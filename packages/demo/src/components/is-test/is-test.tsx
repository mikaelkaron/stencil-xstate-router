import { h, Component, Prop } from '@stencil/core';
import { Send, RouterState } from 'stencil-xstate-router/dist/types';
import { DemoContext, DemoSchema, DemoEvent } from '../types';

@Component({
  tag: 'is-test',
  shadow: true
})
export class IsTest {
  @Prop() send!: Send<DemoContext, DemoSchema, DemoEvent>;

  @Prop() state!: RouterState<DemoContext, DemoEvent>;

  @Prop() testId: string;

  render() {
    return [
      `test ${this.testId}`,
      JSON.stringify(this.state.value),
      JSON.stringify(this.state.context),
      <button onClick={() => this.send('HOME')}>home</button>,
      <button onClick={() => this.send('ACCOUNT')}>account</button>,
      <button onClick={() => this.send('TEST')}>overview</button>,
      <button onClick={() => this.send('DETAILS', { params: { testId: "321" } })}>details</button>,
      <button onClick={() => this.send('LOGOUT')}>logout</button>
    ];
  }
}
