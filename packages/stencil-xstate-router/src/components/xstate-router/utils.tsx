import { h } from '@stencil/core';
import { EventObject, StateMachine } from 'xstate';
import {
  ComponentRenderer,
  RouteConditionPredicate,
  RouteEvent,
  RouteTransitionDefinition
} from './types';

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
export const routeGuard: RouteConditionPredicate<any, RouteEvent> = (
  _,
  event,
  { cond }
) => event.path === cond.path;

export const getPathById = <TContext, TSchema, TEvent extends EventObject>(
  machine: StateMachine<TContext, TSchema, TEvent>,
  id: string
) => machine.getStateNodeById(id).path.join('.');

export const getTarget = <TContext, TEvent extends EventObject>(
  transition: RouteTransitionDefinition<TContext, TEvent>
) => {
  const target = transition.target;
  if (target.length !== 1) {
    throw new Error(
      `expected target.length to be 1, current: ${target.length}`
    );
  }
  return target[0];
};

export const getTransition = <TContext, TEvent extends EventObject>(
  transitions: RouteTransitionDefinition<TContext, TEvent>[]
) => {
  if (transitions.length !== 1) {
    throw new Error(
      `expected transitions.length to be 1, current: ${transitions.length}`
    );
  }
  return transitions[0];
};

export const getPath = <TContext, TEvent extends EventObject>(
  transition: RouteTransitionDefinition<TContext, TEvent>
) => {
  if (!transition.cond || !transition.cond.path) {
    throw new Error('expected transition.cond.path to exist');
  }
  return transition.cond.path;
};