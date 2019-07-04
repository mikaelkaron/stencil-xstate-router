import { h } from '@stencil/core';
import { EventObject, StateMachine, StateSchema } from 'xstate';
import {
  ComponentRenderer,
  RouterInterpreterOptions,
  StateRenderer
} from '../xstate-router/types';

export interface XstateRouterNavigoProps<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> {
  machine: StateMachine<TContext, TSchema, TEvent>;
  options?: RouterInterpreterOptions;
  stateRenderer?: StateRenderer<TContext, TSchema, TEvent>;
  componentRenderer?: ComponentRenderer<TContext, TSchema, TEvent>;
  capture?: boolean;
  root?: string;
  routes?: Record<string, string>;
  useHash?: boolean;
  hash?: string;
};

/**
 * Functional component wrapper around XstateRouterNavigo
 * @param props Component props
 * @param children Component children
 */
export const XstateRouterNavigo: <
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
>(
  props: XstateRouterNavigoProps<TContext, TSchema, TEvent>
) => Element = props => <xstate-router-navigo {...props} />;

export default XstateRouterNavigo;