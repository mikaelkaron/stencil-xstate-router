import { Component, State } from '@stencil/core';
import { Machine, assign, send, GuardMeta, EventObject } from 'xstate';

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
              cond: 'isAuthenticated'
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
              })
            },
            account: {
              entry: send({
                type: 'ROUTED',
                url: '/account'
              })
            },
            test: {
              initial: 'overview',
              states: {
                overview: {
                  entry: send({
                    type: 'ROUTED',
                    url: '/tests'
                  })
                },
                details: {
                  entry: [
                    assign({
                      params: (ctx, event) => event.params || ctx.params
                    }),
                    send(ctx => ({
                      type: 'ROUTED',
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
              cond: 'isNotAuthenticated'
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
              type: 'canRoute',
              path: '/',
              exact: true
            }
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
              path: '/tests/:testId'
            }
          }
        ]
      }
    },
    {
      guards: {
        isNotAuthenticated: ctx => !ctx.authenticated,
        isAuthenticated: ctx => ctx.authenticated,
        canRoute: (
          _,
          event,
          { cond }: GuardMeta<Context, EventObject> & { cond: { path: string } }
        ) => event.path === cond.path
      }
    }
  );

  render() {
    return (
      <xstate-router
        machine={this.machine}
        route={(path, exact) => {
          console.log(`subscribe ${path}:${exact}`);
          return () => console.log(`unsubscribe ${path}`);
        }}
        routed={url => console.log(`go ${url}`)}
      />
    );
  }
}
