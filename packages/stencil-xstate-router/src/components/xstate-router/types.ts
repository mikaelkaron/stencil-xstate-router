import {
  ActionObject,
  EventObject,
  GuardPredicate,
  Interpreter,
  OmniEventObject,
  State as RouterState,
  StateMeta,
  StateSchema,
  TransitionConfig,
  InterpreterOptions,
} from 'xstate';

export { RouterState };

export type Send<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = Interpreter<TContext, TSchema, TEvent>['send'];

export type NavigationHandler = (url: string) => void;

export type RouteHandler<
  TContext,
  TSchema extends StateSchema,
  TEvent extends RouteEvent
> = (
  routes: [{ path: string; [key: string]: any }],
  send: Send<TContext, TSchema, TEvent>
) => VoidFunction[];

export type StateRenderer<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = (
  component: JSX.Element[] | JSX.Element,
  current: RouterState<TContext, TEvent>,
  send: Send<TContext, TSchema, TEvent>,
  service: Interpreter<TContext, TSchema, TEvent>
) => JSX.Element[] | JSX.Element;

export type ComponentRenderer<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = (
  component: string,
  props?: ComponentProps<TContext, TSchema, TEvent>
) => JSX.Element[] | JSX.Element;

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
   * URL routed to
   */
  url?: string;
};

export type ComponentProps<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = {
  /**
   * Current state
   */
  current: RouterState<TContext, TEvent>;
  /**
   * Sends events to the service
   */
  send: Send<TContext, TSchema, TEvent>;
  /**
   * Current service
   */
  service: Interpreter<TContext, TSchema, TEvent>;
} & Record<string, any>;

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
