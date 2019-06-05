import { Component } from '@stencil/core';
import { Machine, assign, EventObject } from 'xstate';
import { RouteCondition } from '../xstate-router'
import 'stencil-xstate';

type Context = Partial<{
  authenticated: boolean;
  params: { [key: string]: string };
}>

const machine = Machine<Context>({
  id: 'app',
  initial: 'idle',
  context: {
    authenticated: false
  },
  states: {
    idle: {
      on: {
        '': {
          target: 'authenticated.current',
          cond: 'isAuthenticated'
        },
        SKIP: 'anonymous'
      },
      after: {
        IDLE: 'anonymous'
      },
      meta: {
        component: 'is-idle'
      }
    },
    anonymous: {
      on: {
        LOGIN: {
          actions: assign({ authenticated: true }),
          target: 'idle'
        }
      },
      meta: {
        component: 'is-anonymous'
      }
    },
    authenticated: {
      initial: 'home',
      states: {
        home: {},
        account: {},
        test: {
          initial: 'overview',
          states: {
            overview: {
              on: {
                DETAILS: 'details'
              }
            },
            details: {}
          },
          on: {
            OVERVIEW: '.overview',
          },
          meta: {
            component: 'is-test'
          }
        },
        current: {
          type: 'history',
          history: 'deep'
        },
      },
      on: {
        LOGOUT: {
          actions: [assign({ authenticated: false })],
          target: 'idle'
        },
        HOME: '.home',
        ACCOUNT: '.account',
        TEST: '.test'
      },
      meta: {
        component: 'is-authenticated'
      }
    }
  },
  on: {
    ROUTE: [
      {
        target: 'authenticated.home',
        cond: {
          type: 'canRoute',
          path: '/',
        },
      },
      {
        target: 'authenticated.account',
        cond: {
          type: 'canRoute',
          path: '/account'
        }
      },
      {
        target: 'authenticated.test',
        cond: {
          type: 'canRoute',
          path: '/tests'
        }
      },
      {
        target: 'authenticated.test.details',
        cond: {
          type: 'canRoute',
          path: '/tests/:testId',
        },
        actions: assign({ params: (_ctx, event) => event.params }),
      }
    ]
  }
}, {
    guards: {
      isAuthenticated: ctx => ctx.authenticated,
      canRoute: (_ctx, event, { cond }: { cond: RouteCondition<Context, EventObject> }) => event.path === cond.path
    },
    delays: {
      IDLE: 2000
    }
  });

@Component({
  tag: 'xstate-router-test',
  shadow: true
})
export class XStateRouterTest {
  render() {
    return <xstate-router machine={machine}></xstate-router>;
  }
}
