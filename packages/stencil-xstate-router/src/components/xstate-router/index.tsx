import { EventObject, Condition, StateSchema, Interpreter } from 'xstate';
import { State as MachineState } from 'xstate';
import { Send } from 'stencil-xstate/dist/types';

export { Send, MachineState };

export type ComponentRenderer<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = (
  Component: string,
  props?: ComponentProps<TContext, TSchema, TEvent>
) => JSX.Element[] | JSX.Element;

export type RouteEvent = EventObject & {
  /**
   * URL routed to
   */
  url?: string;
  /**
   * Path routed to
   */
  path?: string;
  /**
   * Is this an exact match
   */
  exact?: boolean;
  /**
   * Route parameters
   */
  params?: Record<string, string>;
};

export type ComponentProps<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = RouteMeta & {
  /**
   * Method to navigate to URL
   */
  go: (url: string) => void;
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
};

export type RouteMeta = Record<string, any> & {
  /**
   * Component tag
   */
  component?: string;
};

export type RouteCondition<TContext, TEvent extends RouteEvent> = RouteEvent &
  Condition<TContext, TEvent>;

/**
 * Merges meta objects
 * @param source XState.State meta object
 * @param target Target object
 */
export const merge: <T extends RouteMeta>(source: T, target?: T | {}) => T = (
  source,
  target = {}
) => Object.keys(source).reduce((result, key) => Object.assign(result, source[key]), target);

/**
 * Renders a component
 * @param Component Component tag
 * @param props Component props
 */
export const renderComponent: ComponentRenderer<any, any, EventObject> = (
  Component,
  props
) => <Component {...props} />;
