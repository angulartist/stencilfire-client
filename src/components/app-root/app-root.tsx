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
  @State() currentUserId: string
  @State() currentUser: User
  @State() hasUserEmail: boolean = true

  @Prop({ connect: 'ion-toast-controller' })
  toastCtrl: HTMLIonToastControllerElement

  // Get ready to grab the current user profile
  @Watch('currentUserId')
  watchUserId(currentUserId: string) {
    if (currentUserId) {
      console.log('I am:', currentUserId)
      this.getUserProfile()
      this.notifyMe()
    }
  }

  @Watch('currentUser')
  watchUser({ email }: User) {
    if (email) {
      console.log('User has email:', email)
      this.hasUserEmail = true
    } else {
      console.log('Unknow user')
      this.hasUserEmail = false
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
      duration: 3000
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
          <ion-route
            url='/email'
            component='app-email'
            componentProps={{ currentUser: this.currentUser }}
          />
          {!this.hasUserEmail ? (
            <ion-route-redirect from='*' to='/email' />
          ) : (
            <ion-route-redirect from='/email' to='/' />
          )}
        </ion-router>
        <ion-nav animated={false} />
      </ion-app>
    ]
  }
}
