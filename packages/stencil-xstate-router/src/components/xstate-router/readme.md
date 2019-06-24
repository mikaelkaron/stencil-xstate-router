# xstate-router



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute | Description                      | Type                                                                                                                                                                                                                                                                           | Default           |
| ---------------------- | --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `componentRenderer`    | --        | Component renderer               | `(component: string, props?: ComponentProps<any, any, EventObject>) => Element \| Element[]`                                                                                                                                                                                   | `renderComponent` |
| `machine` _(required)_ | --        | An XState machine                | `StateMachine<any, any, EventObject>`                                                                                                                                                                                                                                          | `undefined`       |
| `navigate`             | --        | Callback for url changes         | `(path: string, params?: Record<string, any>) => void`                                                                                                                                                                                                                         | `() => {}`        |
| `options`              | --        | Interpreter options              | `RouterInterpreterOptions`                                                                                                                                                                                                                                                     | `undefined`       |
| `route`                | --        | Callback for route subscriptions | `(routes: Route[]) => VoidFunction`                                                                                                                                                                                                                                            | `() => () => {}`  |
| `routes`               | --        | Routes to register               | `{ [x: string]: string; }`                                                                                                                                                                                                                                                     | `{ ROUTE: '' }`   |
| `stateRenderer`        | --        | State renderer                   | `(component: Element \| Element[], current: State<any, RouteEvent>, send: (event: SingleOrArray<OmniEvent<RouteEvent>>, payload?: Record<string, any> & { type?: undefined; }) => State<any, RouteEvent>, service: Interpreter<any, any, RouteEvent>) => Element \| Element[]` | `undefined`       |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
