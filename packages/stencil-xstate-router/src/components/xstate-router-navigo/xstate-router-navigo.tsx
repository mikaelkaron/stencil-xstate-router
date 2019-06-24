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
  @State() private recognizer = new RouteRecognizer();
  @State() private router: Navigo;

  /**
   * An XState machine
   */
  @Prop() machine!: StateMachine<any, any, EventObject>;

  /**
   * Routes to register
   */
  @Prop() routes?: Record<string, string>;

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
      el.tagName.toLowerCase() === 'a' &&
      // that the link has a `href` attribute
      el.hasAttribute('href')
    ) {
      // normalize href attribute
      const href = el
        .getAttribute('href')
        .replace(new RegExp(`^${this.hash}`), '');
      // check if we recognize this url
      if (this.recognizer.recognize(href)) {
        // stop default click action
        event.preventDefault();
        // navigate to the url
        this.router.navigate(href);
      }
    }
  }

  render() {
    const { options, routes, stateRenderer, componentRenderer } = this;
    return (
      <xstate-router
        machine={this.machine}
        route={routes => {
          // add routes to recognizer
          routes.forEach(route => this.recognizer.add([route]));
          // add routes to router
          this.router.on(
            routes.reduce(
              (acc, { path, handler }) => ({
                ...acc,
                [path]: handler
              }),
              {}
            )
          );
          // return unsubscribe
          return () =>
            routes.forEach(({ path, handler }) =>
              this.router.off(path, handler)
            );
        }}
        navigate={(path, params) => {
          // replace params in path
          const url = path.replace(/:(\w+)/g, (_, key) => params[key]);
          // compare hash/pathname with url and navigate if no match
          if (
            this.useHash
              ? location.hash !== `${this.hash}${url}`
              : location.pathname !== url
          ) {
            this.router.navigate(url);
          }
        }}
        // pass down config to router
        {...{ options, routes, stateRenderer, componentRenderer }}
      >
        <slot />
      </xstate-router>
    );
  }
}
