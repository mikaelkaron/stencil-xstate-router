import { Component, ComponentInterface, h, Prop } from '@stencil/core';
import { RouterState, Send } from 'stencil-xstate-router';
import { DemoContext, DemoEvent, DemoSchema } from '../types';

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
