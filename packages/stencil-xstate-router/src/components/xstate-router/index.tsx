import { h } from '@stencil/core';
import { EventObject, StateMachine, StateSchema } from 'xstate';
import {
  ComponentRenderer,
  NavigationHandler,
  RouteHandler,
  RouterInterpreterOptions,
  StateRenderer
} from './types';

export * from './types';
export * from './utils';

export interface XstateRouterProps<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> {
  machine: StateMachine<TContext, TSchema, TEvent>;
  options?: RouterInterpreterOptions;
  stateRenderer?: StateRenderer<TContext, TSchema, TEvent>;
  componentRenderer?: ComponentRenderer<TContext, TSchema, TEvent>;
  route?: RouteHandler;
  routes?: Record<string, string>;
  navigate?: NavigationHandler;
}

/**
 * Functional component wrapper for XstateRouter
 * @param props Component props
 * @param children Component children
 */
export const XstateRouter: <
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
>(
  props: XstateRouterProps<TContext, TSchema, TEvent>,
  children?: Element[]
) => Element = (props, children) => (
  <xstate-router {...props}>{children}</xstate-router>
);

export default XstateRouter;
