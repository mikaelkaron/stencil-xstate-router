import { EventObject, Condition, StateSchema, Interpreter } from 'xstate';

import { Send } from 'stencil-xstate/dist/types';
import { State as MachineState } from 'xstate';

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
  url?: string;
  path?: string;
  exact?: boolean;
  params?: Record<string, string>;
};

export type ComponentProps<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> = RouteMeta & {
  go: (url: string) => void;
  current: MachineState<TContext, TEvent>;
  send: Send<TContext, TSchema, TEvent>;
  service: Interpreter<TContext, TSchema, TEvent>;
};

export type RouteMeta = Record<string, any> & {
  component: string;
};

export type RouteCondition<TContext, TEvent extends RouteEvent> = RouteEvent &
  Condition<TContext, TEvent>;

export const merge: <T extends RouteMeta>(meta: T, obj?: T | {}) => T = (
  meta,
  obj = {}
) => Object.keys(meta).reduce((acc, key) => Object.assign(acc, meta[key]), obj);

export const renderComponent: ComponentRenderer<any, any, EventObject> = (
  Component,
  props
) => <Component {...props} />;
