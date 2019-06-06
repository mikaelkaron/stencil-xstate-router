import { Component, Prop, ComponentInterface } from '@stencil/core';
import { StateMachine, interpret, Interpreter } from 'xstate';
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
  private history: RouterHistory;
  private match: MatchResults;
  private url: string;

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

  private eventListener = event => {
    // only proccess ROUTED events
    if (event.type === this.ROUTED) {
      // prevent push if it's the current url
      if (event.url !== this.history.createHref(this.history.location)) {
        // store url and push on history
        this.history.push(this.url = event.url);
      }
    }
  };

  private stateRenderer: Renderer<any, any, any> = (current, send, service) => {
    const { component: Component, ...params } = mergeMeta(current.meta);
    if (Component === undefined) {
      throw new Error(`no component defined in ${current.toStrings(current.value)}.meta`);
    }
    return <Component current={current} send={send} service={service} history={this.history} {...params} {...current.context.params} />
  };

  private routeRenderer = (props: RouteRenderProps) => {
    // prevent sending during first render 
    if (!this.loaded) {
      // store match so we can send after render
      this.match = props.match;
      // store history
      this.history = props.history;
    }
    // prevent sending during ROUTED event
    else if (this.url !== props.match.url) {
      // don't block next ROUTED event
      delete this.url;
      // this is irritating but needed (maybe because we're in the middle of `render`)
      window.requestAnimationFrame(() => this.service.send(this.ROUTE, this.match = props.match));
    }
  };

  componentWillLoad() {
    this.service = interpret(this.machine, this.options).onEvent(this.eventListener);
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
    return <xstate-service service={this.service} renderer={this.stateRenderer}>
      <stencil-router>
        {this.machine.on[this.ROUTE].map(({ cond: { path, exact } }: { cond?: RouteCondition<any, any> }) => <stencil-route url={path} exact={exact} routeRender={this.routeRenderer} />)}
      </stencil-router>
    </xstate-service>;
  }
}
