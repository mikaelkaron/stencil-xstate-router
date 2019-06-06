/* tslint:disable */
/**
 * This is an autogenerated file created by the Stencil compiler.
 * It contains typing information for all components that exist in this project.
 */


import '@stencil/core';

import '@stencil/router';
import '@stencil/state-tunnel';
import 'stencil-xstate';
import {
  Options,
  Send,
} from 'stencil-xstate/dist/types';
import {
  State,
  StateMachine,
} from 'xstate';


export namespace Components {

  interface IsAnonymous {
    'current': State<any, any>;
    'send': Send<any, any, any>;
  }
  interface IsAnonymousAttributes extends StencilHTMLAttributes {
    'current': State<any, any>;
    'send': Send<any, any, any>;
  }

  interface IsAuthenticated {
    'current': State<any, any>;
    'send': Send<any, any, any>;
  }
  interface IsAuthenticatedAttributes extends StencilHTMLAttributes {
    'current': State<any, any>;
    'send': Send<any, any, any>;
  }

  interface IsIdle {
    'current': State<any, any>;
    'send': Send<any, any, any>;
  }
  interface IsIdleAttributes extends StencilHTMLAttributes {
    'current': State<any, any>;
    'send': Send<any, any, any>;
  }

  interface IsTest {
    'current': State<any, any>;
    'send': Send<any, any, any>;
    'testId': string;
  }
  interface IsTestAttributes extends StencilHTMLAttributes {
    'current': State<any, any>;
    'send': Send<any, any, any>;
    'testId'?: string;
  }

  interface XstateRouterTest {}
  interface XstateRouterTestAttributes extends StencilHTMLAttributes {}

  interface XstateRouter {
    /**
    * Should machine be initialized with initial route
    */
    'initial': boolean;
    /**
    * An XState machine
    */
    'machine': StateMachine<any, any, any>;
    /**
    * Interpreter options that you can pass in
    */
    'options'?: Options;
    /**
    * Event name for ROUTE
    */
    'route': string;
    /**
    * Event name for ROUTED
    */
    'routed': string;
  }
  interface XstateRouterAttributes extends StencilHTMLAttributes {
    /**
    * Should machine be initialized with initial route
    */
    'initial'?: boolean;
    /**
    * An XState machine
    */
    'machine': StateMachine<any, any, any>;
    /**
    * Interpreter options that you can pass in
    */
    'options'?: Options;
    /**
    * Event name for ROUTE
    */
    'route'?: string;
    /**
    * Event name for ROUTED
    */
    'routed'?: string;
  }
}

declare global {
  interface StencilElementInterfaces {
    'IsAnonymous': Components.IsAnonymous;
    'IsAuthenticated': Components.IsAuthenticated;
    'IsIdle': Components.IsIdle;
    'IsTest': Components.IsTest;
    'XstateRouterTest': Components.XstateRouterTest;
    'XstateRouter': Components.XstateRouter;
  }

  interface StencilIntrinsicElements {
    'is-anonymous': Components.IsAnonymousAttributes;
    'is-authenticated': Components.IsAuthenticatedAttributes;
    'is-idle': Components.IsIdleAttributes;
    'is-test': Components.IsTestAttributes;
    'xstate-router-test': Components.XstateRouterTestAttributes;
    'xstate-router': Components.XstateRouterAttributes;
  }


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

  interface HTMLIsIdleElement extends Components.IsIdle, HTMLStencilElement {}
  var HTMLIsIdleElement: {
    prototype: HTMLIsIdleElement;
    new (): HTMLIsIdleElement;
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

  interface HTMLXstateRouterElement extends Components.XstateRouter, HTMLStencilElement {}
  var HTMLXstateRouterElement: {
    prototype: HTMLXstateRouterElement;
    new (): HTMLXstateRouterElement;
  };

  interface HTMLElementTagNameMap {
    'is-anonymous': HTMLIsAnonymousElement
    'is-authenticated': HTMLIsAuthenticatedElement
    'is-idle': HTMLIsIdleElement
    'is-test': HTMLIsTestElement
    'xstate-router-test': HTMLXstateRouterTestElement
    'xstate-router': HTMLXstateRouterElement
  }

  interface ElementTagNameMap {
    'is-anonymous': HTMLIsAnonymousElement;
    'is-authenticated': HTMLIsAuthenticatedElement;
    'is-idle': HTMLIsIdleElement;
    'is-test': HTMLIsTestElement;
    'xstate-router-test': HTMLXstateRouterTestElement;
    'xstate-router': HTMLXstateRouterElement;
  }


  export namespace JSX {
    export interface Element {}
    export interface IntrinsicElements extends StencilIntrinsicElements {
      [tagName: string]: any;
    }
  }
  export interface HTMLAttributes extends StencilHTMLAttributes {}

}
