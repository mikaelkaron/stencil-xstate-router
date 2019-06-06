import { EventObject, Condition, GuardMeta, GuardPredicate, OmniEventObject } from "xstate";

export type RouteCondition<TContext, TEvent extends EventObject> = Condition<TContext, TEvent> & { path?: string, exact?: boolean };

export type RouteConditionPredicate<TContext, TEvent extends EventObject> = (context: TContext, event: TEvent, meta: RouteGuardMeta<TContext, TEvent>) => boolean;

export type RouteGuardMeta<TContext, TEvent extends EventObject> = GuardMeta<TContext, TEvent> & { cond: RouteCondition<TContext, TEvent> };

export interface RouteGuardPredicate<TContext, TEvent extends EventObject> extends GuardPredicate<TContext, TEvent> {
  predicate: RouteConditionPredicate<TContext, OmniEventObject<TEvent>>;
}

export const RouteGuard = <TContext, TEvent extends EventObject>(_ctx, event, { cond }: RouteGuardMeta<TContext, TEvent>) => event.path === cond.path;