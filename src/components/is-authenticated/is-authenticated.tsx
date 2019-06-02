import { Component, Prop } from '@stencil/core';
import { State} from 'xstate';
import { Send } from 'stencil-xstate/dist/types';

@Component({
  tag: 'is-authenticated',
  shadow: true
})
export class IsAuthenticated {
  @Prop() send!: Send<any, any, any>;

  @Prop() current!: State<any, any>;

  render() {
    return [
      JSON.stringify(this.current.value),
      <button onClick={() => this.send('HOME')}>home</button>,
      <button onClick={() => this.send('ACCOUNT')}>account</button>,
      <button onClick={() => this.send('LOGOUT')}>logout</button>
    ];
  }
}
