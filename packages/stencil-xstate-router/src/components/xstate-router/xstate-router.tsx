import { Component, ComponentInterface, Prop, State } from '@stencil/core';
import 'stencil-xstate';
import { Options, Renderer } from 'stencil-xstate/dist/types';
import { EventObject, interpret, Interpreter, StateMachine } from 'xstate';
import {
  ComponentProps,
  ComponentRenderer,
  merge,
  NavigationEventObject,
  NavigationHandler,
  renderComponent,
  RouteCondition,
  RouteEventObject,
  routeGuard,
  RouteHandler,
  RouteMeta,
  StateRenderer
} from './index';

@Component({
  tag: 'xstate-router',
  shadow: false
})
export class XStateRouter implements ComponentInterface {
  @State() private service: Interpreter<any, any, EventObject>;
  @State() private subscriptions: Set<VoidFunction> = new Set();

  /**
   * An XState machine
   */
  @Prop() machine!: StateMachine<any, any, EventObject>;

  /**
   * Interpreter options
   */
  @Prop() options?: Options;

  /**
   * Should state.meta be merged
   */
  @Prop() merge: boolean = true;

  /**
   * State renderer
   */
  @Prop() stateRenderer: StateRenderer<any, any, RouteEventObject>;

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
  @Prop() route!: RouteHandler<any, any, RouteEventObject>;

  /**
   * Callback for url changes
   */
  @Prop() navigate!: NavigationHandler;

  componentWillLoad() {
    // configure maching with route guard
    const machine = this.machine.withConfig({
      guards: {
        route: routeGuard
      }
    });
    // create service
    this.service = interpret(machine, this.options);
    // extract routes from machine
    const routes = machine.on['ROUTE'];
    if (!routes) {
      throw new Error('no ROUTE events found on root node');
    }
    // loop routes and add route subscribe/unsubscribe
    routes.forEach(
      ({ cond: { path } }: { cond?: RouteCondition<any, RouteEventObject> }) =>
        this.route([{ path }], this.service.send).forEach(unsubscribe =>
          this.subscriptions.add(unsubscribe)
        )
    );
    // add event handler for machine NAVIGATE event
    this.service.onEvent((event: NavigationEventObject) => {
      if (event.type === 'NAVIGATE') {
        this.navigate(event.url);
      }
    });
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
    const componentRenderer: Renderer<any, any, EventObject> = (
      current,
      send,
      service
    ) => {
      // exctact component data from state metadata
      const { component, ...params }: RouteMeta = this.merge
        ? merge(current.meta)
        : current.meta;
      if (component === undefined) {
        throw new Error(
          `no component defined in ${current.toStrings(current.value)}.meta`
        );
      }
      // create component props, note the order
      const props: ComponentProps<any, any, EventObject> = {
        ...params,
        ...current.context.params,
        current,
        send,
        service
      };
      // render component
      return this.componentRenderer(component, props);
    };

    const serviceRenderer: Renderer<any, any, EventObject> = (
      current,
      send,
      service
    ) =>
      this.stateRenderer
        ? // if there's a stateRenderer render component and pass as args
          this.stateRenderer(
            componentRenderer(current, send, service),
            current,
            send,
            service
          )
        : // otherwise just render the component
          componentRenderer(current, send, service);

    return <xstate-service service={this.service} renderer={serviceRenderer} />;
  }
}
