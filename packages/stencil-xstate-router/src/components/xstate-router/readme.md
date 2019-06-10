# xstate-router



<!-- Auto Generated Below -->


## Properties

| Property                  | Attribute | Description                      | Type                                                                                                                                                                                                                                                                           | Default                      |
| ------------------------- | --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------------------------- |
| `componentRenderer`       | --        | Renderer for components          | `(Component: string, props?: ComponentProps<any, any, EventObject>) => Element \| Element[]`                                                                                                                                                                                   | `renderComponent`            |
| `machine` _(required)_    | --        | An XState machine                | `StateMachine<any, any, EventObject>`                                                                                                                                                                                                                                          | `undefined`                  |
| `navigation` _(required)_ | --        | Callback for url changes         | `(url: string) => void`                                                                                                                                                                                                                                                        | `undefined`                  |
| `options`                 | --        | Interpreter options              | `Options`                                                                                                                                                                                                                                                                      | `{     immediate: false   }` |
| `route` _(required)_      | --        | Callback for route subscriptions | `(path: string, exact: boolean, send: (event: SingleOrArray<OmniEvent<RouteEvent>>, payload?: Record<string, any> & { type?: undefined; }) => State<any, RouteEvent>) => VoidFunction`                                                                                         | `undefined`                  |
| `stateRenderer`           | --        | Renderer for states              | `(component: Element \| Element[], current: State<any, RouteEvent>, send: (event: SingleOrArray<OmniEvent<RouteEvent>>, payload?: Record<string, any> & { type?: undefined; }) => State<any, RouteEvent>, service: Interpreter<any, any, RouteEvent>) => Element \| Element[]` | `undefined`                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
