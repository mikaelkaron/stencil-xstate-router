import { EventObject } from 'xstate';
import {
  ComponentRenderer,
  RouteConditionPredicate,
  RouteEvent
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
) => ({ tagName: Component, ...props });

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
