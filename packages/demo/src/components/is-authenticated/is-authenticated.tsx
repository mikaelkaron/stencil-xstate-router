import { h, Component, Prop, ComponentInterface } from '@stencil/core';
import { Send, RouterState } from 'stencil-xstate-router/dist/types';

@Component({
  tag: 'is-authenticated',
  shadow: true
})
export class IsAuthenticated implements ComponentInterface {
  @Prop() send!: Send<any, any, any>;

  @Prop() state!: RouterState<any, any>;

  componentWillLoad() {
    console.log(`will load: ${JSON.stringify(this.state.value)}`);
  }

  componentDidUnload() {
    console.log(`did unload: ${JSON.stringify(this.state.value)}`)
  }

  render() {
    return [
      JSON.stringify(this.state.value),
      <button onClick={() => this.send('HOME')}>home</button>,
      <button onClick={() => this.send('ACCOUNT')}>account</button>,
      <button onClick={() => this.send('TEST')}>test</button>,
      <button onClick={() => this.send('LOGOUT')}>logout</button>,
      <a href='/tests'>/tests</a>,
      <a href='/tests/123'>/tests/123</a>,
      <a href='/tests'><span>deep tests</span></a>
    ];
  }
}
