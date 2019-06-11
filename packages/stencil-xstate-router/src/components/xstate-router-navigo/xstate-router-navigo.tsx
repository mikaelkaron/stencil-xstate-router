import { Component, State, Prop, ComponentInterface } from '@stencil/core';
import { StateMachine, EventObject } from 'xstate';
import Navigo from 'navigo';

@Component({
  tag: 'xstate-router-navigo',
  shadow: false
})
export class XStateRouterNavigo implements ComponentInterface {
  @State() router = new Navigo();

  /**
   * An XState machine
   */
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
        route={(routes, send) =>
          routes
            ? routes
                // https://github.com/krasimir/navigo/pull/39
                .sort((a, b) => b.path.length - a.path.length)
                .map(({ path }) => {
                  const handler = (params: Record<string, any>) =>
                    send({
                      type: 'ROUTE',
                      path,
                      params
                    });

                  this.router.on(path, handler);

                  return () => this.router.off(path, handler);
                })
            : []
        }
        navigate={url =>
          url !== window.location.pathname && this.router.navigate(url)
        }
      />
    );
  }
}
