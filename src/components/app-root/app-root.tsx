import { Component, Host, h, Prop, State } from '@stencil/core';

@Component({
  tag: 'app-root'
})
export class AppRoot {

  @State() nativeConnectedCallbacks = 0;
  @State() nativeDisconnectedCallbacks = 0;

  @Prop({ reflect: true }) stencilConnectedCallbacks = 0;
  @Prop({ reflect: true }) stencilDisconnectedCallbacks = 0;

  // Turn this to true to have the elements print out debug
  private debug = false;

  private leakRate = 1000;

  private container: HTMLDivElement;

  componentDidLoad() {

    const self = this;
    // Register a new "native" custom element for comparison purposes
    customElements.define('app-custom', class CustomElement extends HTMLElement {
      connectedCallback() {
        if (self.debug) {
          console.log('Custom connected');
        }
        self.nativeConnectedCallbacks++;
      }
      disconnectedCallback() {
        if (self.debug) {
          console.log('Custom disconnected');
        }
        self.nativeDisconnectedCallbacks++;
      }
    });

    setInterval(async () => {

      // Perform exactly the same operations on a stencil and a "native" custom element
      // First create one
      const stencilElm = document.createElement('app-child');
      const customElm = document.createElement('app-custom');

      // Append them to the document body - should trigger a connectedCallback
      document.body.appendChild(stencilElm);
      document.body.appendChild(customElm);

      // Move them - this should trigger a disconnect and then a connect
      this.container.appendChild(stencilElm);
      this.container.appendChild(customElm);

      // Finally remove them, triggering a final disconnect
      stencilElm.remove();
      customElm.remove();
    }, this.leakRate);
  }


  render() {
    return <Host>Test Running
      <ul>
        <li>Native Connected Callbacks: {this.nativeConnectedCallbacks}</li>
        <li>Native Disconnected Callbacks: {this.nativeDisconnectedCallbacks}</li>
        <li>Stencil Connected Callbacks: {this.stencilConnectedCallbacks}</li>
        <li>Stencil Disconnected Callbacks: {this.stencilDisconnectedCallbacks}</li>
      </ul>
      <div class="container" ref={ref => this.container = ref}></div>
    </Host>;
  }
}
