import { Component, State } from '@stencil/core';
import { Machine, assign, send } from 'xstate';
import 'stencil-xstate-router';

type Context = {
  authenticated?: boolean;
  params?: { [key: string]: string };
};

@Component({
  tag: 'xstate-router-test',
  shadow: false
})
export class XStateRouterTest {
  @State() machine = Machine<Context>(
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
            home: {
              entry: send({
                type: 'NAVIGATE',
                url: '/'
              })
            },
            account: {
              entry: send({
                type: 'NAVIGATE',
                url: '/account'
              })
            },
            test: {
              initial: 'overview',
              states: {
                overview: {
                  entry: send({
                    type: 'NAVIGATE',
                    url: '/tests'
                  })
                },
                details: {
                  entry: [
                    assign({
                      params: (ctx, event) => event.params || ctx.params
                    }),
                    send(ctx => ({
                      type: 'NAVIGATE',
                      url: `/tests/${ctx.params.testId}`
                    }))
                  ]
                }
              },
              on: {
                DETAILS: {
                  target: '.details',
                  internal: false,
                  cond: (_ctx, event) => event.params && event.params.testId
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
              cond: 'noAuth'
            },
            HOME: {
              target: '.home'
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
        LOGIN: {
          actions: assign({ authenticated: true }),
          target: 'authenticated.current'
        },
        LOGOUT: {
          actions: [assign({ authenticated: false })],
          target: 'anonymous'
        },
        ROUTE: [
          {
            target: 'authenticated.home',
            cond: {
              type: 'route',
              path: '/'
            }
          },
          {
            target: 'authenticated.account',
            cond: {
              type: 'route',
              path: '/account'
            }
          },
          {
            target: 'authenticated.test',
            cond: {
              type: 'route',
              path: '/tests'
            }
          },
          {
            target: 'authenticated.test.details',
            cond: {
              type: 'route',
              path: '/tests/:testId'
            }
          }
        ]
      }
    },
    {
      guards: {
        noAuth: ctx => !ctx.authenticated,
        isAuth: ctx => ctx.authenticated
      }
    }
  );

  render() {
    return <xstate-router-navigo machine={this.machine} />;
  }
}
