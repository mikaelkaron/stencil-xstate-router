/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import { HTMLStencilElement, JSXBase } from '@stencil/core/internal';
import {
  Send,
} from 'stencil-xstate-router/dist/types';
import {
  State,
} from 'xstate';

export namespace Components {
  interface IsAnonymous {
    'current': State<any, any>;
    'send': Send<any, any, any>;
  }
  interface IsAuthenticated {
    'current': State<any, any>;
    'send': Send<any, any, any>;
  }
  interface IsTest {
    'current': State<any, any>;
    'send': Send<any, any, any>;
    'testId': string;
  }
  interface XstateRouterTest {}
}

declare global {


  interface HTMLIsAnonymousElement extends Components.IsAnonymous, HTMLStencilElement {}
  var HTMLIsAnonymousElement: {
    prototype: HTMLIsAnonymousElement;
    new (): HTMLIsAnonymousElement;
  };

  interface HTMLIsAuthenticatedElement extends Components.IsAuthenticated, HTMLStencilElement {}
  var HTMLIsAuthenticatedElement: {
    prototype: HTMLIsAuthenticatedElement;
    new (): HTMLIsAuthenticatedElement;
  };

  interface HTMLIsTestElement extends Components.IsTest, HTMLStencilElement {}
  var HTMLIsTestElement: {
    prototype: HTMLIsTestElement;
    new (): HTMLIsTestElement;
  };

  interface HTMLXstateRouterTestElement extends Components.XstateRouterTest, HTMLStencilElement {}
  var HTMLXstateRouterTestElement: {
    prototype: HTMLXstateRouterTestElement;
    new (): HTMLXstateRouterTestElement;
  };
  interface HTMLElementTagNameMap {
    'is-anonymous': HTMLIsAnonymousElement;
    'is-authenticated': HTMLIsAuthenticatedElement;
    'is-test': HTMLIsTestElement;
    'xstate-router-test': HTMLXstateRouterTestElement;
  }
}

declare namespace LocalJSX {
  interface IsAnonymous extends JSXBase.HTMLAttributes<HTMLIsAnonymousElement> {
    'current': State<any, any>;
    'send': Send<any, any, any>;
  }
  interface IsAuthenticated extends JSXBase.HTMLAttributes<HTMLIsAuthenticatedElement> {
    'current': State<any, any>;
    'send': Send<any, any, any>;
  }
  interface IsTest extends JSXBase.HTMLAttributes<HTMLIsTestElement> {
    'current': State<any, any>;
    'send': Send<any, any, any>;
    'testId'?: string;
  }
  interface XstateRouterTest extends JSXBase.HTMLAttributes<HTMLXstateRouterTestElement> {}

  interface IntrinsicElements {
    'is-anonymous': IsAnonymous;
    'is-authenticated': IsAuthenticated;
    'is-test': IsTest;
    'xstate-router-test': XstateRouterTest;
  }
}

export { LocalJSX as JSX };


declare module "@stencil/core" {
  export namespace JSX {
    interface IntrinsicElements extends LocalJSX.IntrinsicElements {}
  }
}


