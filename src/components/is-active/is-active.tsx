import { Component, Prop } from '@stencil/core';
import { State} from 'xstate';
import { Send } from 'stencil-xstate/dist/types';

@Component({
  tag: 'is-active',
  shadow: true
})
export class IsComponent {
  @Prop() send!: Send<any, any, any>;

  @Prop() current!: State<any, any>;

  render() {
    return <button onClick={() => this.send('TOGGLE')}>active: {String(this.current.context.active)}: {JSON.stringify(this.current.value)}</button>;
  }
}
