/// <reference types="firebase" />

import { Component } from '@stencil/core'
@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss'
})
export class AppRoot {
  render() {
    return [
      <ion-app>
        <ion-modal-controller />,
        <ion-router useHash={false}>
          <ion-route url='/' component='app-matchmaker' />
        </ion-router>
        <ion-nav animated={false} />
      </ion-app>
    ]
  }
}
