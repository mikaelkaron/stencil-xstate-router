import { EventObject, StateSchema } from 'xstate';
import { RouterProps } from './types';

export * from './types';
export * from './utils';

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
) => JSX.Element = (props, children) => (
  <xstate-router {...props}>{children}</xstate-router>
);

export default Router;
