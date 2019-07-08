import {
  Component,
  ComponentInterface,
  h,
  Listen,
  Prop,
  State
} from '@stencil/core';
import Navigo from 'navigo';
import { parse } from 'query-string';
import RouteRecognizer from 'route-recognizer';
import { EventObject, StateMachine } from 'xstate';
import {
  ComponentRenderer,
  RouterInterpreterOptions,
  StateRenderer
} from '../xstate-router/types';

const composedPath = (target: Element) => {
  const path = [];
  let node: Node = target;
  while (node.parentNode !== null) {
    path.push(node);
    node = node.parentNode;
  }
  path.push(document, window);
  return path as Element[];
};

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
  @Prop() stateRenderer?: StateRenderer<any, any, EventObject>;

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
   * Parse query string for params
   */
  @Prop() useQs?: boolean = true;

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
    // normalize event path
    const path = event.composed
      ? (event.composedPath() as Element[])
      : composedPath(event.target as Element);
    // extract link element from event taking into account shadow DOM
    const link = path.find(
      el =>
        // make sure this is _really_ an Element
        el.nodeType === Node.ELEMENT_NODE &&
        // and that we're a link
        el.tagName.toLowerCase() === 'a' &&
        // and that we have a href attribute
        el.hasAttribute('href')
    );
    // check that we found a link,
    // are capturing clicks
    // and that nobody else handled this already
    if (link && this.capture && !event.defaultPrevented) {
      // normalize href attribute
      const href = link
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
                [path]: (params: Record<string, any>, query: string) =>
                  handler(
                    // parsing QS for params?
                    this.useQs
                      ? // is this the default handler
                        path === '/'
                        ? // query is passed as params
                          parse((params as unknown) as string)
                        : // combine params and query
                          { ...params, ...parse(query) }
                      : // since we're not parsing QS just pass params
                        params
                  )
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
      />
    );
  }
}
