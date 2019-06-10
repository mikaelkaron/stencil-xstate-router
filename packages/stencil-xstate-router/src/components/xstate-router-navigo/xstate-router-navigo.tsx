import { Component, State, Prop, ComponentInterface } from '@stencil/core';
import { StateMachine, EventObject } from 'xstate';
import Navigo from 'navigo';

@Component({
  tag: 'xstate-router-navigo',
  shadow: false
})
export class XStateRouterNavigo implements ComponentInterface {
  @State() router = new Navigo();

  @Prop() machine!: StateMachine<any, any, EventObject>;

  componentDidLoad() {
    this.router.resolve();
  }

  componentDidUnload() {
    this.router.destroy();
  }

  render() {
    return (
      <xstate-router
        machine={this.machine}
        route={(path, _exact, send) => {
          const handler = (params: Record<string, any>) =>
            send({
              type: 'ROUTE',
              path,
              params
            });

          this.router.on(path, handler);

          return () => this.router.off(path, handler);
        }}
        navigation={url =>
          url !== location.pathname && this.router.navigate(url)
        }
      />
    );
  }
}
