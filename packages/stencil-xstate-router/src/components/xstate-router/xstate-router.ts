import { Component, ComponentInterface, Prop, State } from '@stencil/core';
import {
  EventObject,
  interpret,
  Interpreter,
  OmniEventObject,
  StateMachine,
  StateNode,
  TransitionDefinition
} from 'xstate';
import {
  ComponentRenderer,
  NavigationHandler,
  Route,
  RouteHandler,
  RouterEvent,
  RouterInterpreterOptions,
  StateRenderer
} from './types';
import { mergeMeta, renderComponent } from './utils';

const getPathById = <TContext, TSchema, TEvent extends EventObject>(
  machine: StateMachine<TContext, TSchema, TEvent>,
  id: string
) => machine.getStateNodeById(id).path.join('.');

const getId = <TContext, TEvent extends EventObject>(
  target: string | StateNode<TContext, any, OmniEventObject<TEvent>>
) =>
  typeof target === 'string'
    ? target
    : (target as StateNode<TContext, any, OmniEventObject<TEvent>>).id;

const getTarget = <TContext, TEvent extends EventObject>(
  transition: TransitionDefinition<TContext, TEvent>
) => {
  const target = transition.target;
  if (target.length !== 1) {
    throw new Error(
      `expected target.length to be 1, current: ${target.length}`
    );
  }
  return target[0];
};

const getTransition = <TContext, TEvent extends EventObject>(
  transitions: TransitionDefinition<TContext, TEvent>[]
) => {
  if (transitions.length !== 1) {
    throw new Error(
      `expected transitions.length to be 1, current: ${transitions.length}`
    );
  }
  return transitions[0];
};

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
  @Prop() routes: Record<string, string> = {};

  /**
   * Interpreter options
   */
  @Prop() options?: RouterInterpreterOptions;

  /**
   * State renderer
   */
  @Prop() stateRenderer?: StateRenderer<any, any, EventObject>;

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
    const { routes, navigate, machine } = this;
    // create service that triggers RENDER on matching transitions
    const service = interpret(machine, this.options);
    const { send, initialState } = service;
    const pathToUrl: Record<string, string> = {};
    const pathToHandler: Route[] = [];

    // loop over routes to build incomming and outgoing tables
    Object.keys(routes).forEach(type => {
      // get transitions from machine by event
      const transitions = machine.on[type];
      // add route to outgouing route table
      const path = (pathToUrl[
        getPathById(machine, getId(getTarget(getTransition(transitions))))
      ] = routes[type]);
      // add route to incomming route table
      pathToHandler.push({
        path,
        handler: params =>
          send({
            type,
            path,
            params
          })
      });
    });
    // call callback and store unsubscribe
    this.unsubscribe = this.route(pathToHandler);
    // store service
    this.service = service
      // add transition handler that triggers RENDER on state transition
      .onTransition(state => {
        const {
          changed,
          meta,
          context: { params: stateParams },
          event
        } = state;
        const { params: eventParams } = event as RouterEvent;
        // return fast if state has not changed and is not the initial state
        if (!changed && state !== initialState) {
          return;
        }
        // default merge to true if not passed in options
        const {
          options: {
            merge = true,
            useEventParams = true,
            useStateParams = true
          } = {}
        } = this;
        // optionally merge state.meta before descruction
        const { component, params: metaParams, slot } = merge
          ? mergeMeta(meta)
          : meta;
        // create params
        const params = {
          ...metaParams,
          ...(useStateParams && stateParams),
          ...(useEventParams && eventParams)
        };
        // if there's a component we RENDER
        if (component) {
          send('RENDER', {
            component,
            slot,
            params
          });
        }
        // get url by reducing state path and matching route
        const path = state
          .toStrings()
          .reduceRight((url, path) => url || pathToUrl[path], undefined);
        // if there's a url we NAVIGATE
        if (path) {
          send('NAVIGATE', {
            path,
            params
          });
        }
      })
      // add event NAVIGATE and RENDER handlers to service
      .onEvent(event => {
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
