import {
  ActionObject,
  EventObject,
  GuardPredicate,
  Interpreter,
  InterpreterOptions,
  OmniEventObject,
  State as RouterState,
  StateMachine,
  StateMeta,
  StateSchema,
  TransitionConfig
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

export type RenderEvent = EventObject & {
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

export type RouteEvent = EventObject & {
  /**
   * Path routed to
   */
  path?: string;
  /**
   * Route parameters
   */
  params?: Record<string, string>;
};

export type NavigationEvent = EventObject & {
  /**
   * Path routed to
   */
  path?: string;

  /**
   * Route params
   */
  params?: Record<string, any>
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
  [key: string]: any;
};

export interface RouteGuardPredicate<TContext, TEvent extends RouteEvent>
  extends GuardPredicate<TContext, TEvent> {
  predicate: RouteConditionPredicate<TContext, OmniEventObject<TEvent>>;
  path: string;
}

export type RouteGuard<TContext, TEvent extends RouteEvent> =
  | RouteGuardPredicate<TContext, TEvent>
  | (Record<string, any> & {
      type: string;
      path: string;
    });

export interface RouteGuardMeta<TContext, TEvent extends RouteEvent>
  extends StateMeta<TContext, TEvent> {
  cond: RouteGuard<TContext, TEvent>;
}

export type RouteConditionPredicate<TContext, TEvent extends RouteEvent> = (
  context: TContext,
  event: TEvent,
  meta: RouteGuardMeta<TContext, TEvent>
) => boolean;

export interface RouteTransitionDefinition<TContext, TEvent extends RouteEvent>
  extends TransitionConfig<TContext, TEvent> {
  target: string[] | undefined;
  actions: Array<ActionObject<TContext, TEvent>>;
  cond?: RouteGuard<TContext, TEvent>;
  event: string;
}

/**
 * Router interpreter options
 */
export interface RouterInterpreterOptions extends Partial<InterpreterOptions> {
  merge?: boolean;
}
