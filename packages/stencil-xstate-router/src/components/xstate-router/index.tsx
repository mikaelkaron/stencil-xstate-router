import {
  Condition,
  EventObject,
  GuardPredicate,
  Interpreter,
  InterpreterOptions,
  OmniEventObject,
  State as MachineState,
  StateMeta,
  StateSchema
} from 'xstate';

export { MachineState };

export type Send<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = Interpreter<TContext, TSchema, TEvent>['send'];

export type NavigationHandler = (url: string) => void;

export type RouteHandler<
  TContext,
  TSchema extends StateSchema,
  TEvent extends RouteEventObject
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
  current: MachineState<TContext, TEvent>,
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

export type RenderEventObject = EventObject & {
  /**
   * Component to render
   */
  component?: string;
  /**
   * Render props
   */
  props?: Record<string, string>;
};

export type RouteEventObject = EventObject & {
  /**
   * Path routed to
   */
  path?: string;
  /**
   * Route parameters
   */
  params?: Record<string, string>;
};

export type NavigationEventObject = EventObject & {
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
  current: MachineState<TContext, TEvent>;
  /**
   * Sends events to the service
   */
  send: Send<TContext, TSchema, TEvent>;
  /**
   * Current service
   */
  service: Interpreter<TContext, TSchema, TEvent>;
  /**
   * Component to render
   */
  component: string;
  /**
   * Component props
   */
  props?: Record<string, string>;
};

export interface RouteGuardPredicate<TContext, TEvent extends RouteEventObject>
  extends GuardPredicate<TContext, TEvent> {
  predicate: RouteConditionPredicate<TContext, OmniEventObject<TEvent>>;
  path: string;
}

export type RouteGuard<TContext, TEvent extends RouteEventObject> =
  | RouteGuardPredicate<TContext, TEvent>
  | (Record<string, any> & {
      type: string;
      path: string;
    });

export interface RouteGuardMeta<TContext, TEvent extends RouteEventObject>
  extends StateMeta<TContext, TEvent> {
  cond: RouteGuard<TContext, TEvent>;
}

export type RouteCondition<
  TContext,
  TEvent extends RouteEventObject
> = Condition<TContext, TEvent> & {
  path?: string;
};

export type RouteConditionPredicate<
  TContext,
  TEvent extends RouteEventObject
> = (
  context: TContext,
  event: TEvent,
  meta: RouteGuardMeta<TContext, TEvent>
) => boolean;

/**
 * Merges meta objects
 * @param source XState.State meta object
 * @param target Target object
 */
export const mergeMeta: <T extends Record<string, any>>(
  source: T,
  target?: T | {}
) => T = (source, target = {}) =>
  Object.keys(source).reduce(
    (result, key) => Object.assign(result, source[key]),
    target
  );

/**
 * Renders a component
 * @param Component Component tag
 * @param props Component props
 */
export const renderComponent: ComponentRenderer<any, any, EventObject> = (
  Component,
  props
) => <Component {...props} />;

/**
 * Guards a route
 * @param context Context
 * @param event Event
 * @param meta Meta
 */
export const routeGuard: RouteConditionPredicate<any, RouteEventObject> = (
  _,
  event,
  { cond }
) => event.path === cond.path;

/**
 * Render interpreter options
 */
export interface RenderInterpreterOptions extends Partial<InterpreterOptions> {
  merge?: boolean;
}
