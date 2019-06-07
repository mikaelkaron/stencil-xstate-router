import { Component } from '@stencil/core';
import { Machine, assign, send } from 'xstate';
import { RouteGuard } from '../xstate-router'
import 'stencil-xstate';

type Context = {
  authenticated?: boolean;
  params?: { [key: string]: string };
}

const machine = Machine<Context>({
  id: 'app',
  initial: 'idle',
  context: {
    authenticated: false
  },
  states: {
    idle: {
      on: {
        '': [
          {
            target: 'authenticated.current',
            cond: 'isAuthenticated',
          },
          {
            target: 'anonymous'
          }
        ]
      },
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
        home: {
          entry: send({
            type: 'ROUTED',
            url: '/'
          }),
        },
        account: {
          entry: send({
            type: 'ROUTED',
            url: '/account'
          }),
        },
        test: {
          initial: 'overview',
          states: {
            overview: {
              entry: send({
                type: 'ROUTED',
                url: '/tests'
              }),
            },
            details: {
              entry: [assign({ params: (_, event) => event.params }), send(ctx => ({
                type: 'ROUTED',
                url: `/tests/${ctx.params.testId}`,
              }))],
            }
          },
          on: {
            OVERVIEW: '.overview',
            DETAILS: {
              target: '.details',
              internal: false,
              cond: (_ctx, event) => !!(event.params && event.params.testId)
            },
          },
          meta: {
            component: 'is-test'
          }
        },
        current: {
          type: 'history',
        },
      },
      on: {
        LOGOUT: {
          actions: [assign({ authenticated: false })],
          target: 'idle'
        },
        HOME: {
          target: '.home',

        },
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
          exact: true
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
          path: '/tests',
          exact: true
        }
      },
      {
        target: 'authenticated.test.details',
        cond: {
          type: 'canRoute',
          path: '/tests/:testId',
        },
      }
    ],
    ROUTED: {
      actions: console.log
    }
  },
}, {
    guards: {
      isAuthenticated: ctx => ctx.authenticated,
      canRoute: RouteGuard
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
