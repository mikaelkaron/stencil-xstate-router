import { Component, ComponentInterface, Prop, State } from '@stencil/core';
import { EventObject, interpret, Interpreter, StateMachine } from 'xstate';
import {
  ComponentRenderer,
  NavigationEvent,
  NavigationHandler,
  RenderEvent,
  Route,
  RouteEvent,
  RouteHandler,
  RouterInterpreterOptions,
  RouteTransitionDefinition,
  StateRenderer
} from './types';
import {
  getPath,
  getPathById,
  getTarget,
  getTransition,
  mergeMeta,
  renderComponent,
  routeGuard
} from './utils';

@Component({
  tag: 'xstate-router',
  shadow: false
})
export class XstateRouter implements ComponentInterface {
  @State() private unsubscribe: VoidFunction;
  @State() private service: Interpreter<any, any, EventObject>;
  @State() private rendered: {
    component: string;
    slot?: string;
    params?: Record<string, any>;
  };

  /**
   * An XState machine
   */
  @Prop() machine!: StateMachine<any, any, EventObject>;

  /**
   * Routes to register
   */
  @Prop() routes: Record<string, string> = { ROUTE: '' };

  /**
   * Interpreter options
   */
  @Prop() options?: RouterInterpreterOptions;

  /**
   * State renderer
   */
  @Prop() stateRenderer?: StateRenderer<any, any, RouteEvent>;

  /**
   * Component renderer
   */
  @Prop() componentRenderer: ComponentRenderer<
    any,
    any,
    EventObject
  > = renderComponent;

  /**
   * Callback for route subscriptions
   */
  @Prop() route: RouteHandler = () => () => {};

  /**
   * Callback for url changes
   */
  @Prop() navigate: NavigationHandler = () => {};

  componentWillLoad() {
    const { routes, navigate } = this;
    // configure maching with route guard
    const machine = this.machine.withConfig({
      guards: {
        route: routeGuard
      }
    });
    // create service that triggers RENDER on matching transitions
    const service = interpret(machine, this.options);
    const { send, initialState } = service;
    const pathToUrl: Record<string, string> = {};
    const pathToHandler: Route[] = [];

    Object.keys(routes).forEach(name => {
      const route = routes[name];
      const transitions = machine.on[name] as RouteTransitionDefinition<
        any,
        RouteEvent
      >[];
      // if path was provided we're using a simple transition
      if (route) {
        // add route to outgouing route table
        const path = (pathToUrl[
          getPathById(machine, getTarget(getTransition(transitions)))
        ] = route);
        // add route to ingoing route table
        pathToHandler.push({
          path,
          handler: params =>
            send({
              type: name,
              path,
              params
            })
        });
      }
      // otherwise loop transitions
      else
        transitions.forEach(transition => {
          // add route to outgouing route table
          const path = (pathToUrl[
            getPathById(machine, getTarget(transition))
          ] = getPath(transition));
          // add route to ingoing route table
          pathToHandler.push({
            path,
            handler: params =>
              send({
                type: name,
                path,
                params
              })
          });
        });
    });
    // call callback and store unsubscribe
    this.unsubscribe = this.route(pathToHandler);
    // store service
    this.service = service
      // add transition handler that triggers RENDER on state transition
      .onTransition(state => {
        // return fast if state has not changed and is not the initial state
        if (!state.changed && state !== initialState) {
          return;
        }
        // default merge to true if not passed in options
        const { merge = true } = this.options || {};
        // optionally merge state.meta before descruction
        const { component, params, slot } = merge
          ? mergeMeta(state.meta)
          : state.meta;
        // get url by reducing state path and matching route
        const path = state
          .toStrings()
          .reduceRight((url, path) => url || pathToUrl[path], undefined);
        // if there's a url we NAVIGATE
        if (path) {
          send('NAVIGATE', {
            path,
            params: { ...params, ...state.context.params }
          });
        }
        // if there's a component we RENDER
        if (component) {
          send('RENDER', {
            component,
            slot,
            params: { ...params, ...state.context.params }
          });
        }
      })
      // add event NAVIGATE and RENDER handlers to service
      .onEvent((event: NavigationEvent | RenderEvent) => {
        const { path, params, component, slot } = event;
        switch (event.type) {
          case 'NAVIGATE':
            if (path) {
              navigate(path, params);
            }
            break;

          case 'RENDER':
            if (component) {
              this.rendered = {
                component,
                slot,
                params
              };
            }
            break;
        }
      });
  }

  componentDidLoad() {
    // start service after child components are ready
    this.service.start();
  }

  componentDidUnload() {
    // unsubscribe from route changes
    this.unsubscribe();
    // stop and clean service
    this.service.stop();
  }

  render() {
    // return fast if we have nothing to render
    if (this.rendered === undefined) {
      return;
    }

    const { service } = this;
    const { state, send } = service;
    const { component, params, slot } = this.rendered;
    const props = {
      state,
      send,
      service,
      slot,
      ...params
    };

    return this.stateRenderer
      ? // if there's a stateRenderer render component and pass
        this.stateRenderer(
          this.componentRenderer(component, props),
          state,
          send,
          service
        )
      : // otherwise just render the component
        this.componentRenderer(component, props);
  }
}
