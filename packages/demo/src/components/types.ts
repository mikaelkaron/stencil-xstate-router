import { StateSchema } from "xstate";

export type DemoContext = {
  authenticated?: boolean;
  params?: { [key: string]: string };
};

export interface DemoSchema extends StateSchema {
  states: {
    anonymous: {};
    authenticated: {
      states: {
        home: {};
        woot: {};
        account: {};
        test: {
          states: {
            overview: {};
            details: {};
          };
        };
        current: {};
      };
    };
  };
}

export type DemoEvent = { params?: Record<string, any> } & (
  | { type: 'LOGIN' }
  | { type: 'LOGOUT' }
  | { type: 'HOME' }
  | { type: 'ACCOUNT' }
  | { type: 'TEST' }
  | { type: 'DETAILS' }
  | { type: 'WOOT' });
