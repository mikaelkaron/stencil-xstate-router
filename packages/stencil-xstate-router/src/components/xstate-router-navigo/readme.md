# xstate-router-navigo



<!-- Auto Generated Below -->


## Properties

| Property               | Attribute  | Description                                                                                                                                            | Type                                  | Default     |
| ---------------------- | ---------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------- | ----------- |
| `capture`              | `capture`  | Capture clicks from child elements and convert to routes                                                                                               | `boolean`                             | `true`      |
| `hash`                 | `hash`     | The hash parameter allows you to configure the hash character                                                                                          | `string`                              | `'#'`       |
| `machine` _(required)_ | --         | An XState machine                                                                                                                                      | `StateMachine<any, any, EventObject>` | `undefined` |
| `root`                 | `root`     | The main URL of your application.                                                                                                                      | `string`                              | `undefined` |
| `useHash`              | `use-hash` | If useHash set to true then the router uses an old routing approach with hash in the URL. Fall back to this mode if there is no History API supported. | `boolean`                             | `false`     |


----------------------------------------------

*Built with [StencilJS](https://stenciljs.com/)*
