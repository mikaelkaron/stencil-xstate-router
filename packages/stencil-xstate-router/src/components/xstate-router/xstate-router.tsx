import { Component, ComponentInterface, Prop, State } from '@stencil/core';
import { EventObject, Interpreter, StateMachine, interpret } from 'xstate';
import {
  ComponentRenderer,
  mergeMeta,
  NavigationEventObject,
  NavigationHandler,
  renderComponent,
  RenderEventObject,
  RenderInterpreterOptions,
  RouteTransitionDefinition,
  RouteEventObject,
  routeGuard,
  RouteHandler,
  StateRenderer
} from './index';

@Component({
  tag: 'xstate-router',
  shadow: false
})
export class XStateRouter implements ComponentInterface {
  @State() private subscriptions: Set<VoidFunction> = new Set();
  @State() private service: Interpreter<any, any, EventObject>;
  @State() private target: {
    component: string;
    params: Record<string, any>;
  };

  /**
   * An XState machine
   */
  @Prop() machine!: StateMachine<any, any, EventObject>;

  /**
   * Interpreter options
   */
  @Prop() options?: RenderInterpreterOptions;

  /**
   * State renderer
   */
  @Prop() stateRenderer?: StateRenderer<any, any, RouteEventObject>;

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
  @Prop() route: RouteHandler<any, any, RouteEventObject> = () => [];

  /**
   * Callback for url changes
   */
  @Prop() navigate: NavigationHandler = () => {};

  componentWillLoad() {
    const { route, navigate } = this;

    // configure maching with route guard
    const machine = this.machine.withConfig({
      guards: {
        route: routeGuard
      }
    });
    // extract routes from machine
    const routes = machine.on['ROUTE'] as RouteTransitionDefinition<
      any,
      RouteEventObject
    >[];
    // create service that triggers RENDER on matching transitions
    const service = interpret(machine, this.options);
    const { send, initialState } = service;
    if (route && routes) {
      // loop routes and add route subscribe/unsubscribe
      routes.forEach(({ cond: { path } }) =>
        route([{ path }], send).forEach(unsubscribe =>
          this.subscriptions.add(unsubscribe)
        )
      );
    }
    service
      // add transition handler that triggers RENDER on state transition
      .onTransition(state => {
        // return fast if state has not changed and is not the initial state
        if (!state.changed && state !== initialState) {
          return;
        }
        // default merge to true if not passed in options
        const { merge = true } = this.options || {};
        // optionally merge state.meta before descruction
        const { component, params } = merge
          ? mergeMeta(state.meta)
          : state.meta;
        // if there's a component, issue render
        if (component) {
          // send RENDER event with payload
          send('RENDER', {
            component,
            params: { ...params, ...state.context.params }
          });
        }
      })
      // add event NAVIGATE and RENDER handlers to service
      .onEvent((event: NavigationEventObject | RenderEventObject) => {
        switch (event.type) {
          case 'NAVIGATE':
            const { url } = event;
            if (navigate) {
              navigate(url);
            }
            break;

          case 'RENDER':
            const { component, params } = event;
            if (component) {
              this.target = {
                component,
                params
              };
            }
            break;
        }
      });
    // store service
    this.service = service;
  }

  componentDidLoad() {
    // start service after child components are ready
    this.service.start();
  }

  componentDidUnload() {
    // unsubscribe from route changes
    this.subscriptions.forEach(unsubscribe => unsubscribe());
    // stop and clean service
    this.service.stop();
  }

  render() {
    // return fast if we have nothing to render
    if (this.target === undefined) {
      return;
    }

    const { service } = this;
    const { state: current, send } = service;
    const { component, params } = this.target;
    const props = {
      component,
      current,
      send,
      service,
      ...params
    };

    return this.stateRenderer
      ? // if there's a stateRenderer render component and pass
        this.stateRenderer(
          this.componentRenderer(component, props),
          current,
          send,
          service
        )
      : // otherwise just render the component
        this.componentRenderer(component, props);
  }
}
