import {
  Component,
  State,
  Prop,
  ComponentInterface,
  Listen
} from '@stencil/core';
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

  /**
   * Capture clicks from child elements and convert to routes
   */
  @Prop() capture: boolean = true;

  componentDidLoad() {
    this.router.resolve();
  }

  componentDidUnload() {
    this.router.destroy();
  }

  @Listen('click')
  handleClick(event: UIEvent & { path: [HTMLElement] }) {
    // extract origin element from event
    const {
      path: [el]
    } = event;
    // check that we're capturing clicks,
    // that we clicked an anchor,
    // and that the link has a `href` attribute
    if (this.capture && el.tagName.toUpperCase() === 'A' && el.hasAttribute('href')) {
      // stop default click action
      event.preventDefault();
      // navigate to the url
      this.router.navigate(el.getAttribute('href'));
    }
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
                // map paths to unsubscribe callbacks
                .map(({ path }) => {
                  const handler = (params: Record<string, any>) =>
                    send({
                      type: 'ROUTE',
                      path,
                      params
                    });
                  // subscribe path to history changes
                  this.router.on(path, handler);
                  // return unsubscribe handler
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
