import { h, Component, Prop, ComponentInterface } from '@stencil/core';
import { Send, RouterState } from 'stencil-xstate-router/dist/types';
import { DemoContext, DemoSchema, DemoEvent } from '../types';

@Component({
  tag: 'is-anonymous',
  shadow: true
})
export class IsAnonymous implements ComponentInterface {
  @Prop() send!: Send<DemoContext, DemoSchema, DemoEvent>;

  @Prop() state!: RouterState<DemoContext, DemoEvent>;

  render() {
    return [
      <button onClick={() => this.send('LOGIN')}>login</button>,
      <button onClick={() => this.send('TEST')}>route</button>
    ];
  }
}
