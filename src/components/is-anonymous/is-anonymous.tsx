import { Component, Prop } from '@stencil/core';
import { State} from 'xstate';
import { Send } from 'stencil-xstate/dist/types';

@Component({
  tag: 'is-anonymous',
  shadow: true
})
export class IsAnonymous {
  @Prop() send!: Send<any, any, any>;

  @Prop() current!: State<any, any>;

  render() {
    return <button onClick={() => this.send('LOGIN')}>{JSON.stringify(this.current.value)}</button>;
  }
}
