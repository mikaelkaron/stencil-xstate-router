import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'xstate',
  outputTargets: [
    {
      type: 'dist',
    },
    {
      type: 'docs-readme'
    }
  ]
};