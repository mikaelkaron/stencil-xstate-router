import { Component, Prop, ComponentInterface } from '@stencil/core';
import { State} from 'xstate';
import { Send } from '../xstate-router';

@Component({
  tag: 'is-authenticated',
  shadow: true
})
export class IsAuthenticated implements ComponentInterface {
  @Prop() send!: Send<any, any, any>;

  @Prop() current!: State<any, any>;

  componentWillLoad() {
    console.log(`will load: ${JSON.stringify(this.current.value)}`);
  }

  componentDidUnload() {
    console.log(`did unload: ${JSON.stringify(this.current.value)}`)
  }

  render() {
    return [
      JSON.stringify(this.current.value),
      <button onClick={() => this.send('HOME')}>home</button>,
      <button onClick={() => this.send('ACCOUNT')}>account</button>,
      <button onClick={() => this.send('TEST')}>test</button>,
      <button onClick={() => this.send('LOGOUT')}>logout</button>,
      <stencil-route-link url='/tests'>/tests</stencil-route-link>,
      <stencil-route-link url='/tests/123'>/tests/123</stencil-route-link>
    ];
  }
}
