# xstate-router



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute     | Description                                      | Type                                                                                                                                     | Default                      |
| ---------------------- | ------------- | ------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- |
| `ROUTE`                | `r-o-u-t-e`   | Event name for ROUTE                             | `string`                                                                                                                                 | `'ROUTE'`                    |
| `ROUTED`               | `r-o-u-t-e-d` | Event name for ROUTED                            | `string`                                                                                                                                 | `'ROUTED'`                   |
| `initial`              | `initial`     | Should machine be initialized with initial route | `boolean`                                                                                                                                | `true`                       |
| `machine` _(required)_ | --            | An XState machine                                | `StateMachine<any, any, EventObject>`                                                                                                    | `undefined`                  |
| `options`              | --            | Interpreter options that you can pass in         | `Options`                                                                                                                                | `{     immediate: false   }` |
| `renderer`             | --            | Renderer called each time state changes          | `(component: Element, current: State<any, EventObject>, send: any, service: Interpreter<any, any, EventObject>) => Element \| Element[]` | `undefined`                  |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
