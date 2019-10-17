import {
  EventObject,
  Interpreter,
  InterpreterOptions,
  State as RouterState,
  StateSchema
} from 'xstate';

export { RouterState };

export type Send<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = Interpreter<TContext, TSchema, TEvent>['send'];

export type NavigationHandler = (
  path: string,
  params?: Record<string, any>
) => void;

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

export interface RouterEvent extends EventObject {
  /**
   * Parameters
   */
  params?: Record<string, any>;
}

export type RenderEvent = RouterEvent & {
  type: 'RENDER';
  /**
   * Component to render
   */
  component: string;
  /**
   * Component slot
   */
  slot?: string;
};

export type NavigationEvent = RouterEvent & {
  type: 'NAVIGATE';
  /**
   * Path routed to
   */
  path: string;
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
}

/**
 * Router interpreter options
 */
export interface RouterInterpreterOptions extends Partial<InterpreterOptions> {
  merge?: boolean;
  useStateParams?: boolean;
  useEventParams?: boolean;
}
