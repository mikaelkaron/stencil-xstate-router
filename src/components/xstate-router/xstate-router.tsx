import { Component, Prop, ComponentInterface } from '@stencil/core';
import { StateMachine, interpret, Interpreter, EventObject, State, SingleOrArray, OmniEvent } from 'xstate';
import { EventListener } from 'xstate/lib/interpreter'
import { Options, Renderer } from 'stencil-xstate/dist/types';
import { RouteRenderProps, RouterHistory, MatchResults } from '@stencil/router';
import { RouteCondition } from './index';
import 'stencil-xstate';
import '@stencil/router';

const mergeMeta = (meta: any, obj = {}) => Object.keys(meta).reduce((acc, key) => Object.assign(acc, meta[key]), obj);

@Component({
  tag: 'xstate-router',
  shadow: true
})
export class XStateRouter implements ComponentInterface {
  private loaded: boolean = false;
  private service: Interpreter<any, any, any>;
  private match: MatchResults;

  /**
   * Event name for ROUTE
   */
  @Prop() ROUTE: string = 'ROUTE';

  /**
   * Event name for ROUTED
   */
  @Prop() ROUTED: string = 'ROUTED';

  /**
   * Should machine be initialized with initial route
   */
  @Prop() initial: boolean = true;

  /**
   * An XState machine
   */
  @Prop() machine!: StateMachine<any, any, any>;

  /**
   * Interpreter options that you can pass in
   */
  @Prop() options?: Options = {
    immediate: false
  };

  /**
   * Renderer called each time state changes
   */
  @Prop() renderer: (component: JSX.Element, current: State<any, EventObject>, send: (event: SingleOrArray<OmniEvent<EventObject>>, payload?: Record<string, any> & { type?: undefined; }) => State<any, EventObject>, service: Interpreter<any, any, EventObject>) => JSX.Element[] | JSX.Element;

  componentWillLoad() {
    this.service = interpret(this.machine, this.options);
  }

  componentDidLoad() {
    this.loaded = true;

    this.service.start();

    if (this.initial && this.match) {
      this.service.send(this.ROUTE, this.match);
    }
  }

  componentDidUnload() {
    this.service.stop();
  }

  render() {
    let history: RouterHistory;
    let url: string;

    const eventListener: EventListener<EventObject> = event => {
      // only proccess ROUTED events
      if (event.type === this.ROUTED) {
        // prevent push if it's the current url
        if (event.url !== history.createHref(history.location)) {
          // store url and push on history
          history.push(url = event.url);
        }
      }
    };

    const componentRenderer: Renderer<any, any, EventObject> = (current, send, service) => {
      const { component: Component, ...params } = mergeMeta(current.meta);
      if (Component === undefined) {
        throw new Error(`no component defined in ${current.toStrings(current.value)}.meta`);
      }
      return <Component current={current} send={send} service={service} history={history} {...params} {...current.context.params} />
    };

    const routeRenderer = (props: RouteRenderProps) => {
      // prevent sending during first render 
      if (!this.loaded) {
        // store match so we can send after render
        this.match = props.match;
        // store history
        history = props.history;
      }
      // prevent sending during ROUTED event
      else if (url !== props.match.url) {
        // don't block next ROUTED event
        url = undefined;
        // this is irritating but needed (maybe because we're in the middle of `render`)
        window.requestAnimationFrame(() => this.service.send(this.ROUTE, this.match = props.match));
      }
    };

    const serviceRenderer: Renderer<any, any, EventObject> = (current, send, service) => this.renderer
      ? this.renderer(componentRenderer(current, send, service), current, send, service)
      : componentRenderer(current, send, service);

    this.service.onEvent(eventListener);

    return [
      <xstate-service service={this.service} renderer={serviceRenderer} />,
      <stencil-router>{this.machine.on[this.ROUTE].map(({ cond: { path, exact } }: { cond?: RouteCondition<any, any> }) => <stencil-route url={path} exact={exact} routeRender={routeRenderer} />)}</stencil-router>,
      <slot />
    ];
  }
}
