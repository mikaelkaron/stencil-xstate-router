import { h, Component, Prop } from '@stencil/core';
import { State } from 'xstate';
import { Send } from 'stencil-xstate-router/dist/types';

@Component({
  tag: 'is-test',
  shadow: true
})
export class IsTest {
  @Prop() send!: Send<any, any, any>;

  @Prop() current!: State<any, any>;

  @Prop() testId: string;

  render() {
    return [
      `test ${this.testId}`,
      JSON.stringify(this.current.value),
      JSON.stringify(this.current.context),
      <button onClick={() => this.send('HOME')}>home</button>,
      <button onClick={() => this.send('ACCOUNT')}>account</button>,
      <button onClick={() => this.send('TEST')}>overview</button>,
      <button onClick={() => this.send('DETAILS', { params: { testId: "321" } })}>details</button>,
      <button onClick={() => this.send('LOGOUT')}>logout</button>
    ];
  }
}
