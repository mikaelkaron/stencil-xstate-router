import { Condition, EventObject } from "xstate";

export type RouteCondition<TContext, TEvent extends EventObject> = Condition<TContext, TEvent> & { path?: string, exact?: boolean };
