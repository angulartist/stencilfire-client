import { Component } from '@stencil/core'

@Component({
  tag: 'app-matchmaker'
})
export class AppMatchmaker {
  render() {
    return [
      <ion-content>
        <app-header />
        <ion-grid>
          <app-converter />
          <app-dongboard />
        </ion-grid>
      </ion-content>
    ]
  }
}
