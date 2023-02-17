import { Component, ComponentInterface, h, Host, Prop } from '@stencil/core';

@Component({
  tag: 'app-child'
})
export class AppChild implements ComponentInterface {

  @Prop() debug = false;

  private listener = (ev) => {
    console.log('Event', ev);
  }

  connectedCallback(): void {
    if (this.debug) {
      console.log('Stencil Connected');
    }
    const root = document.querySelector('app-root');
    root.stencilConnectedCallbacks = root.stencilConnectedCallbacks + 1;
    window.addEventListener('testEvent', this.listener);
  }

  disconnectedCallback(): void {
    if (this.debug) {
      console.log('Stencil Disconnected');
    }
    const root = document.querySelector('app-root');
    root.stencilDisconnectedCallbacks = root.stencilDisconnectedCallbacks + 1;
    window.removeEventListener('testEvent', this.listener);
  }

  render() {
    return <Host />;
  }
}
