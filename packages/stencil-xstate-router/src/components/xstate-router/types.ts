import {
  EventObject,
  Interpreter,
  InterpreterOptions,
  State as RouterState,
  StateMachine,
  StateSchema,
} from 'xstate';

export { RouterState };

export type Send<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = Interpreter<TContext, TSchema, TEvent>['send'];

export type NavigationHandler = (path: string, params?: Record<string, any>) => void;

export type RouteHandler = (routes: Route[]) => VoidFunction;

export type Route = {
  path: string;
  handler: (params?: Record<string, any>) => any;
};

export type StateRenderer<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = (
  component: Element[] | Element,
  state: RouterState<TContext, TEvent>,
  send: Send<TContext, TSchema, TEvent>,
  service: Interpreter<TContext, TSchema, TEvent>
) => Element[] | Element;

export type ComponentRenderer<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = (
  component: string,
  props?: ComponentProps<TContext, TSchema, TEvent>
) => Element[] | Element;

export type RenderEvent = {
  type: 'RENDER',
  /**
   * Component to render
   */
  component: string;
  /**
   * Component slot
   */
  slot?: string;
  /**
   * Component params
   */
  params?: Record<string, any>;
};

export interface RouteEvent extends EventObject {
  /**
   * Path routed to
   */
  path: string;
  /**
   * Route parameters
   */
  params?: Record<string, any>;
};

export type NavigationEvent = RouteEvent & {
  type: 'NAVIGATE'
};

export interface RouterProps<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> {
  machine: StateMachine<TContext, TSchema, TEvent>;
  options?: RouterInterpreterOptions;
  stateRenderer?: StateRenderer<any, any, RouteEvent>;
  componentRenderer?: ComponentRenderer<any, any, EventObject>;
  route?: RouteHandler;
  navigate?: NavigationHandler;
};

export interface ComponentProps<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> {
  /**
   * Current state
   */
  state: RouterState<TContext, TEvent>;
  /**
   * Sends events to the service
   */
  send: Send<TContext, TSchema, TEvent>;
  /**
   * Current service
   */
  service: Interpreter<TContext, TSchema, TEvent>;
};

/**
 * Router interpreter options
 */
export interface RouterInterpreterOptions extends InterpreterOptions {
  merge?: boolean;
}
