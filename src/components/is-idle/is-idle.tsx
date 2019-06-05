
import { Component, Prop } from '@stencil/core';
import { State} from 'xstate';
import { Send } from 'stencil-xstate/dist/types';

@Component({
  tag: 'is-idle',
  shadow: true
})
export class IsIdle {
  @Prop() send!: Send<any, any, any>;

  @Prop() current!: State<any, any>;

  render() {
    return [
      <button onClick={() => this.send('SKIP')}>Skip delay</button>,
    ];
  }
}
