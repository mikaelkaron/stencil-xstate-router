import { Component, Prop, ComponentInterface } from '@stencil/core';
import { StateMachine, interpret, Interpreter } from 'xstate';
import { Options, Renderer } from 'stencil-xstate/dist/types';
import { RouteCondition } from './index';
import 'stencil-xstate';
import '@stencil/router';

const mergeMeta = (meta, obj = {}) => Object.keys(meta).reduce((acc, key) => Object.assign(acc, meta[key]), obj);

const stateRenderer: Renderer<any, any, any> = (current, send, service) => {
  const { component: Component, ...meta } = mergeMeta(current.meta);
  if (Comment === undefined) {
    throw new Error(`no component defined in ${JSON.stringify(current.value)}.meta`);
  }
  return <Component current={current} send={send} service={service} {...meta} {...current.context.params} />
};

@Component({
  tag: 'xstate-router',
  shadow: true
})
export class XStateRouter implements ComponentInterface {
  private service: Interpreter<any, any, any>;
  private loaded: boolean = false;
  private route: any;

  @Prop() key: string = 'ROUTE';

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

  componentWillLoad() {
    this.service = interpret(this.machine, this.options);
  }

  componentDidLoad() {
    this.loaded = true;

    this.service.start();

    if (this.route) {
      this.service.send(this.key, this.route);
    }
  }

  componentDidUnload() {
    this.service.stop();
  }

  render() {
    const routeRenderer = props => {
      if (this.loaded) {
        // this is irritating but needed (maybe because we're in the middle of `render`)
        window.setTimeout(() => this.service.send(this.key, props.match));
      }
      else {
        this.route = props.match
      }
    };

    return <xstate-service service={this.service} renderer={stateRenderer}>
      <stencil-router>
        {this.machine.on[this.key].map(({ cond: { path, exact = true } }: { cond?: RouteCondition<any, any> }) => <stencil-route url={path} exact={exact} routeRender={routeRenderer} />)}
      </stencil-router>
    </xstate-service>;
  }
}
