import { EventObject, StateSchema } from 'xstate';
import {
  ComponentRenderer,
  RouteConditionPredicate,
  RouteEvent,
  RouterProps
} from './types';

export * from './types';

/**
 * Functional component wrapper for XstateRouter
 * @param props Component props
 * @param children Component children
 */
export const Router: <
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
>(
  props: RouterProps<TContext, TSchema, TEvent>,
  children?: JSX.Element[]
) => JSX.Element = (
  { machine, options, route, navigate, stateRenderer, componentRenderer },
  children
) => (
  <xstate-router
    machine={machine}
    options={options}
    route={route}
    navigate={navigate}
    stateRenderer={stateRenderer}
    componentRenderer={componentRenderer}
  >
    {children}
  </xstate-router>
);

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

export default Router;
