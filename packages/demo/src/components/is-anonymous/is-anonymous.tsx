import { Component, Prop } from '@stencil/core';
import { State} from 'xstate';
import { Send } from 'stencil-xstate-router/dist/types';

@Component({
  tag: 'is-anonymous',
  shadow: true
})
export class IsAnonymous {
  @Prop() send!: Send<any, any, any>;

  @Prop() current!: State<any, any>;

  render() {
    return [
    <button onClick={() => this.send('LOGIN')}>login</button>,
    <button onClick={() => this.send('ROUTE', {"path":"/tests","url":"/tests","isExact":true,"params":{}})}>route</button>,
  ];
  }
}
