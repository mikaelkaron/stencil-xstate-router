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
  @State() router: Navigo;

  /**
   * An XState machine
   */
  @Prop() machine!: StateMachine<any, any, EventObject>;

  /**
   * Capture clicks from child elements and convert to routes
   */
  @Prop() capture?: boolean = true;

  /**
   * The main URL of your application.
   */
  @Prop() root?: string;

  /**
   * If useHash set to true then the router uses an old routing approach with hash in the URL. Fall back to this mode if there is no History API supported.
   */
  @Prop() useHash?: boolean = false;

  /**
   * The hash parameter allows you to configure the hash character
   */
  @Prop() hash?: string = '#';

  componentWillLoad() {
    this.router = new Navigo(this.root, this.useHash, this.hash);
  }

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
    if (
      // check that we're capturing clicks,
      this.capture &&
      // that we clicked an anchor,
      el.tagName.toUpperCase() === 'A' &&
      // and that the link has a `href` attribute
      el.hasAttribute('href')
    ) {
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
          // compare location/hash with url and navigate if no match
          (this.useHash
            ? window.location.hash !== `${this.hash}${url}`
            : window.location.pathname !== url) && this.router.navigate(url)
        }
      />
    );
  }
}
