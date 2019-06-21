import {
  Component,
  ComponentInterface,
  Listen,
  Prop,
  State
} from '@stencil/core';
import Navigo from 'navigo';
import { EventObject, StateMachine } from 'xstate';
import {
  ComponentRenderer,
  RouteEvent,
  RouterInterpreterOptions,
  StateRenderer
} from '../xstate-router/types';
import RouteRecognizer from 'route-recognizer';

@Component({
  tag: 'xstate-router-navigo',
  shadow: false
})
export class XstateRouterNavigo implements ComponentInterface {
  @State() private routes = new RouteRecognizer();
  @State() private router: Navigo;

  /**
   * An XState machine
   */
  @Prop() machine!: StateMachine<any, any, EventObject>;

  /**
   * Interpreter options
   */
  @Prop() options?: RouterInterpreterOptions;

  /**
   * State renderer
   */
  @Prop() stateRenderer?: StateRenderer<any, any, RouteEvent>;

  /**
   * Component renderer
   */
  @Prop() componentRenderer: ComponentRenderer<any, any, EventObject>;

  /**
   * Capture clicks from child elements and convert to routes
   */
  @Prop() capture?: boolean = true;

  /**
   * The main URL of your application.
   */
  @Prop() root?: string;

  /**
   * If useHash set to true then the router uses an old routing approach with hash in the URL.
   * Fall back to this mode if there is no History API supported.
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
  handleClick(event: Event) {
    // extract origin element from event taking into account shadow DOM
    const el = (event.composed
      ? event.composedPath()[0]
      : event.target) as Element;
    if (
      // check that we're capturing clicks,
      this.capture &&
      // that nobody else handled this already
      !event.defaultPrevented &&
      // that we clicked an anchor,
      el.tagName.toUpperCase() === 'A' &&
      // that the link has a `href` attribute
      el.hasAttribute('href')
    ) {
      // normalize href attribute
      const href = el
        .getAttribute('href')
        .replace(new RegExp(`^${this.hash}`), '');
      // check if we recognize this url
      if (this.routes.recognize(href)) {
        // stop default click action
        event.preventDefault();
        // navigate to the url
        this.router.navigate(href);
      }
    }
  }

  render() {
    const { options, stateRenderer, componentRenderer } = this;
    return (
      <xstate-router
        machine={this.machine}
        route={(routes, send) =>
          routes
            ? routes
                // map paths to unsubscribe callbacks
                .map(({ path }) => {
                  const handler = (params: Record<string, any>) =>
                    send({
                      type: 'ROUTE',
                      path,
                      params
                    });
                  // add path to this.routes
                  this.routes.add([{ path, handler }]);
                  // subscribe path to history changes
                  this.router.on(path, handler);
                  // return unsubscribe handler
                  return () => this.router.off(path, handler);
                })
            : []
        }
        navigate={url =>
          // compare hash/pathname with url and navigate if no match
          (this.useHash
            ? location.hash !== `${this.hash}${url}`
            : location.pathname !== url) && this.router.navigate(url)
        }
        // pass down config to router
        {...{ options, stateRenderer, componentRenderer }}
      >
        <slot />
      </xstate-router>
    );
  }
}
