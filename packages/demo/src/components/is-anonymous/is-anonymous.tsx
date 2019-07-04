import { h, Component, Prop, ComponentInterface } from '@stencil/core';
import { Send, RouterState } from 'stencil-xstate-router/dist/types';

@Component({
  tag: 'is-anonymous',
  shadow: true
})
export class IsAnonymous implements ComponentInterface {
  @Prop() send!: Send<any, any, any>;

  @Prop() state!: RouterState<any, any>;

  render() {
    return [
      <button onClick={() => this.send('LOGIN')}>login</button>,
      <button onClick={() => this.send('TEST')}>route</button>
    ];
  }
}
