import { Component, Prop, State, ComponentInterface } from '@stencil/core';
import { StateMachine, interpret, Interpreter, EventObject } from 'xstate';
import { Options, Renderer } from 'stencil-xstate/dist/types';
import {
  ComponentProps,
  ComponentRenderer,
  RouteCondition,
  RouteMeta,
  RouteEvent,
  Send,
  MachineState,
  merge,
  renderComponent
} from './index';
import 'stencil-xstate';

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
  @Prop() stateRenderer: (
    component: JSX.Element[] | JSX.Element,
    current: MachineState<any, EventObject>,
    send: Send<any, any, RouteEvent>,
    service: Interpreter<any, any, EventObject>
  ) => JSX.Element[] | JSX.Element;

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
  @Prop() route!: (
    path: string,
    exact: boolean,
    send: Send<any, any, RouteEvent>
  ) => VoidFunction;

  /**
   * Callback for url changes
   */
  @Prop() routed!: (url: string) => void;

  componentWillLoad() {
    this.service = interpret(this.machine, this.options);

    this.machine.on['ROUTE'].forEach(
      ({ cond: { path, exact } }: { cond?: RouteCondition<any, RouteEvent> }) =>
        this.subscriptions.add(this.route(path, exact, this.service.send))
    );

    this.service.onEvent((event: RouteEvent) => {
      if (event.type === 'ROUTED') {
        this.routed(event.url);
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
        go: this.routed,
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
