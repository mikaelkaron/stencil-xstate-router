# xstate-router



<!-- Auto Generated Below -->


## Properties

| Property                | Attribute | Description                      | Type                                                                                                                                                                                                                                                                                                   | Default           |
| ----------------------- | --------- | -------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ----------------- |
| `componentRenderer`     | --        | Component renderer               | `(component: string, props?: ComponentProps<any, any, EventObject>) => Element \| Element[]`                                                                                                                                                                                                           | `renderComponent` |
| `machine` _(required)_  | --        | An XState machine                | `StateMachine<any, any, EventObject>`                                                                                                                                                                                                                                                                  | `undefined`       |
| `navigate` _(required)_ | --        | Callback for url changes         | `(url: string) => void`                                                                                                                                                                                                                                                                                | `undefined`       |
| `options`               | --        | Interpreter options              | `RenderInterpreterOptions`                                                                                                                                                                                                                                                                             | `undefined`       |
| `route` _(required)_    | --        | Callback for route subscriptions | `(routes: [{ [key: string]: any; path: string; }], send: (event: SingleOrArray<OmniEvent<RouteEventObject>>, payload?: Record<string, any> & { type?: undefined; }) => State<any, RouteEventObject>) => VoidFunction[]`                                                                                | `undefined`       |
| `stateRenderer`         | --        | State renderer                   | `(component: Element \| Element[], current: State<any, RouteEventObject>, send: (event: SingleOrArray<OmniEvent<RouteEventObject>>, payload?: Record<string, any> & { type?: undefined; }) => State<any, RouteEventObject>, service: Interpreter<any, any, RouteEventObject>) => Element \| Element[]` | `undefined`       |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
