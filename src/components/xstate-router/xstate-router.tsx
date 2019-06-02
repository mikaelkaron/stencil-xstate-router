import { Component, Prop } from '@stencil/core';
import { Machine, assign, StateMachine } from 'xstate';
import { Options } from 'stencil-xstate/dist/types';
import 'stencil-xstate';

type Context = {
  authenticated: boolean;
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
        '': {
          target: 'authenticated.current',
          cond: 'isAuthenticated'
        },
        AUTHENTICATED: 'authenticated',
        ANONYMOUS: 'anonymous'
      },
      after: {
        IDLE: 'anonymous'
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
          }
        },
        current: {
          type: 'history',
          history: 'deep'
        },
      },
      on: {
        LOGOUT: {
          actions: assign({ authenticated: false }),
          target: 'idle'
        },
        HOME: '.home',
        ACCOUNT: '.account',
        TEST: '.test',
        DETAILS: '.test.details'
      },
      meta: {
        component: 'is-authenticated'
      }
    }
  }
}, {
    guards: {
      isAuthenticated: ctx => ctx.authenticated
    },
    delays: {
      IDLE: 2000
    }
  });

const merge = (meta, obj = {}) => Object.keys(meta).reduce((acc, key) => Object.assign(acc, meta[key]), obj);

const renderer = (current, send, service) => {
  const { component: Component, ...meta } = merge(current.meta);
  return Component && <Component current={current} send={send} service={service} {...meta} />
};

@Component({
  tag: 'xstate-router',
  shadow: true
})
export class XStateRouter {
  /**
   * An XState machine
   */
  @Prop() machine: StateMachine<any, any, any> = machine;

  /**
   * Interpreter options that you can pass in
   */
  @Prop() options?: Options = {
    immediate: false
  };

  render() {
    return <xstate-machine machine={this.machine} options={this.options} renderer={renderer}></xstate-machine>;
  }
}
