import { h, Component, State } from '@stencil/core';
import { Machine, assign } from 'xstate';
import 'stencil-xstate-router';
import { DemoContext, DemoEvent, DemoSchema } from '../types';
import { XstateRouterNavigo } from 'stencil-xstate-router';

@Component({
  tag: 'xstate-router-test',
  shadow: false
})
export class XStateRouterTest {
  @State() machine = Machine<DemoContext, DemoSchema, DemoEvent>(
    {
      id: 'app',
      initial: 'anonymous',
      context: {
        authenticated: false
      },
      states: {
        anonymous: {
          on: {
            '': {
              target: 'authenticated.current',
              cond: 'isAuth'
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
            woot: {},
            account: {},
            test: {
              initial: 'overview',
              states: {
                overview: {},
                details: {
                  entry: assign({
                    params: (ctx, event) => event.params || ctx.params
                  })
                }
              },
              meta: {
                component: 'is-test'
              }
            },
            current: {
              type: 'history',
              history: 'deep'
            }
          },
          on: {
            '': {
              target: 'anonymous',
              cond: 'isAnon'
            }
          },
          meta: {
            component: 'is-authenticated'
          }
        }
      },
      on: {
        LOGIN: {
          actions: assign({ authenticated: true }),
          target: 'authenticated.current'
        },
        LOGOUT: {
          actions: [assign({ authenticated: false })],
          target: 'anonymous'
        },
        WOOT: 'authenticated.woot',
        HOME: 'authenticated.home',
        ACCOUNT: 'authenticated.account',
        TEST: 'authenticated.test',
        DETAILS: {
          target: 'authenticated.test.details',
          internal: false,
          cond: (_ctx, event) => event.params && event.params.testId
        }
      }
    },
    {
      guards: {
        isAnon: ctx => !ctx.authenticated,
        isAuth: ctx => ctx.authenticated
      }
    }
  );

  render() {
    return (
      <XstateRouterNavigo
        machine={this.machine}
        routes={{
          WOOT: '/woot',
          HOME: '/',
          ACCOUNT: '/account',
          TEST: '/tests',
          DETAILS: '/tests/:testId'
        }}
      />
    );
  }
}
