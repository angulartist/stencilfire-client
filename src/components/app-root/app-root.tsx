/// <reference types="firebase" />

declare const db: firebase.firestore.Firestore
declare const auth: firebase.auth.Auth

import { Component, Prop, State, Watch } from '@stencil/core'
import { authState } from 'rxfire/auth'
import { docData } from 'rxfire/firestore'
import { User } from '../../models'

@Component({
  tag: 'app-root',
  styleUrl: 'app-root.scss'
})
export class AppRoot {
  @Prop({ connect: 'ion-toast-controller' })
  toastCtrl: HTMLIonToastControllerElement

  @State() currentUserId: string
  @State() currentUser: User

  // Get ready to grab the current user profile
  @Watch('currentUserId')
  watchUserId(currentUserId: string) {
    if (currentUserId) {
      console.log('I am:', currentUserId)
      this.getUserProfile()
      this.notifyMe()
    }
  }

  componentDidLoad() {
    this.monitorAuth()
  }

  getUserProfile() {
    const ref = db.doc(`users/${this.currentUserId}`)

    docData(ref, 'id').subscribe(d => (this.currentUser = d))
  }

  monitorAuth() {
    authState(auth).subscribe((user: firebase.User) => {
      if (user) {
        this.currentUserId = user.uid
      }

      auth.signInAnonymously()
    })
  }

  async notifyMe() {
    const toast = await this.toastCtrl.create({
      message: 'Connected',
      showCloseButton: true,
      duration: 3000,
      closeButtonText: 'Okay'
    })

    toast.present()
  }

  render() {
    return [
      <ion-app>
        <ion-router useHash={false}>
          <ion-route
            url='/'
            component='app-start'
            componentProps={{ currentUser: this.currentUser }}
          />
          <ion-route
            url='/chest/:chestId'
            component='app-chest'
            componentProps={{ currentUser: this.currentUser }}
          />
          <ion-route url='/login/' component='app-chest' />
        </ion-router>
        <ion-nav animated={false} />
      </ion-app>
    ]
  }
}
