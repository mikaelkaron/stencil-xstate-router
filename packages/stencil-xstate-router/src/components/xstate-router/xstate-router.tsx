import { Component, ComponentInterface, Prop, State } from '@stencil/core';
import 'stencil-xstate';
import { Options, Renderer } from 'stencil-xstate/dist/types';
import { EventObject, interpret, Interpreter, StateMachine } from 'xstate';
import {
  merge,
  ComponentProps,
  ComponentRenderer,
  NavigationHandler,
  renderComponent,
  RouteCondition,
  RouteEvent,
  RouteHandler,
  RouteMeta,
  StateRenderer,
  routeGuard
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
  @Prop() options?: Options = {
    immediate: false
  };

  /**
   * Renderer for states
   */
  @Prop() stateRenderer: StateRenderer<any, any, RouteEvent>;

  /**
   * Renderer for components
   */
  @Prop() componentRenderer: ComponentRenderer<
    any,
    any,
    EventObject
  > = renderComponent;

  /**
   * Callback for route subscriptions
   */
  @Prop() route!: RouteHandler<any, any, RouteEvent>;

  /**
   * Callback for url changes
   */
  @Prop() navigate!: NavigationHandler;

  componentWillLoad() {
    const machine = this.machine.withConfig({
      guards: {
        route: routeGuard
      }
    });

    this.service = interpret(machine, this.options);

    const routes = machine.on['ROUTE'];
    if (!routes) {
      throw new Error('no ROUTE events found on root node');
    }

    routes.forEach(
      ({ cond: { path } }: { cond?: RouteCondition<any, RouteEvent> }) =>
        this.route([{ path }], this.service.send).forEach(unsubscribe =>
          this.subscriptions.add(unsubscribe)
        )
    );

    this.service.onEvent((event: RouteEvent) => {
      if (event.type === 'ROUTED') {
        this.navigate(event.url);
      }
    });
  }

  componentDidLoad() {
    this.service.start();
  }

  componentDidUnload() {
    this.subscriptions.forEach(unsubscribe => unsubscribe());

    this.service.stop();
  }

  render() {
    const componentRenderer: Renderer<any, any, EventObject> = (
      current,
      send,
      service
    ) => {
      const { component, ...params }: RouteMeta = merge(current.meta);
      if (component === undefined) {
        throw new Error(
          `no component defined in ${current.toStrings(current.value)}.meta`
        );
      }
      const props: ComponentProps<any, any, EventObject> = {
        ...params,
        ...current.context.params,
        current,
        send,
        service
      };
      return this.componentRenderer(component, props);
    };

    const serviceRenderer: Renderer<any, any, EventObject> = (
      current,
      send,
      service
    ) =>
      this.stateRenderer
        ? this.stateRenderer(
            componentRenderer(current, send, service),
            current,
            send,
            service
          )
        : componentRenderer(current, send, service);

    return <xstate-service service={this.service} renderer={serviceRenderer} />;
  }
}
