import { h } from '@stencil/core';
import { EventObject } from 'xstate';
import { ComponentRenderer } from './types';

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
