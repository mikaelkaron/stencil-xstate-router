import { h } from '@stencil/core';
import { EventObject, StateMachine, StateSchema } from 'xstate';
import {
  ComponentRenderer,
  RouteEvent,
  RouterInterpreterOptions,
  StateRenderer
} from '../xstate-router/types';

export interface RouterNavigoProps<
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
> {
  machine: StateMachine<TContext, TSchema, TEvent>;
  options?: RouterInterpreterOptions;
  stateRenderer?: StateRenderer<any, any, RouteEvent>;
  componentRenderer?: ComponentRenderer<any, any, EventObject>;
  capture?: boolean;
  root?: string;
  useHash?: boolean;
  hash?: string;
};

/**
 * Functional component wrapper around XstateRouterNavigo
 * @param props Component props
 * @param children Component children
 */
export const RouterNavigo: <
  TContext,
  TSchema extends StateSchema,
  TEvent extends EventObject
>(
  props: RouterNavigoProps<TContext, TSchema, TEvent>
) => Element = props => <xstate-router-navigo {...props} />;
