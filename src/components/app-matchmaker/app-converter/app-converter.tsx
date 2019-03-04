/// <reference types="firebase" />

declare const db: firebase.firestore.Firestore
declare const auth: firebase.auth.Auth

import { Component, State, Watch } from '@stencil/core'
import { docData } from 'rxfire/firestore'
import { authState } from 'rxfire/auth'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

@Component({
  tag: 'app-converter',
  styleUrl: 'app-converter.scss'
})
export class AppConverter {
  destroy$: Subject<boolean> = new Subject<boolean>()
  sizeInputEl: HTMLIonInputElement

  @State() currentUser: any
  @State() currentUserId: string
  @State() inputValue: number

  @Watch('currentUserId')
  watchUserId(currentUserId: string) {
    if (currentUserId) {
      this.watchUser()
    }
  }

  componentDidLoad() {
    this.watchAuthState()
  }

  // Avoid memory leaks
  componentDidUnload() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  watchAuthState() {
    authState(auth)
      .pipe(takeUntil(this.destroy$))
      .subscribe((user: firebase.User) => {
        if (user) {
          this.currentUserId = user.uid
        }

        auth.signInAnonymously()
      })
  }

  watchUser() {
    const ref = db.doc(`users/${this.currentUserId}`)

    docData(ref, 'id')
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => (this.currentUser = user))
  }

  updateInput(e: CustomEvent) {
    this.inputValue = parseInt(e.detail.value)
  }

  async openCheckout() {
    const modalController = document.querySelector('ion-modal-controller')
    await modalController.componentOnReady()

    const modalElement = await modalController.create({
      component: 'app-checkout',
      componentProps: {
        billingAmount: this.billingAmount,
        formatedInput: this.formatedInput
      }
    })

    await modalElement.present()

    const { data } = await modalElement.onDidDismiss()

    if (typeof data === 'undefined') {
      this.inputValue = 0
      this.sizeInputEl.value = ''
    }
  }

  get isValidInput() {
    return (
      this.inputValue &&
      typeof this.inputValue === 'number' &&
      this.inputValue >= 69 &&
      this.inputValue <= 50000
    )
  }

  get billingAmount() {
    if (this.isValidInput) return this.inputValue
  }

  get formatedInput() {
    if (this.isValidInput) return this.inputValue / 100
  }

  render() {
    return [
      <ion-row justify-content-center>
        <ion-col sizeMd='7' sizeLg='4'>
          <ion-card class='preBillingCard'>
            <ion-card-content>
              <ion-input
                ref={(el: HTMLIonInputElement) => (this.sizeInputEl = el)}
                inputMode='numeric'
                autofocus
                type='number'
                placeholder={`Enter your desired size in mm*`}
                onIonChange={event => this.updateInput(event)}
              />
              <ion-text color='medium' class='dongInfo'>
                <p>* 1 cent = 1mm</p>
                <p>* at least 69mm are required</p>
              </ion-text>
            </ion-card-content>
            {!this.isValidInput ? (
              <ion-item
                lines='none'
                color='light'
                text-center
                class='checkoutDisabled'
              >
                <ion-itext class='checkoutButton'>
                  <span>Checkout</span>
                </ion-itext>
              </ion-item>
            ) : (
              <ion-item
                lines='none'
                color='success'
                class='checkoutEnabled'
                text-center
                onClick={() => this.openCheckout()}
              >
                <ion-itext class='checkoutButton'>
                  <span>Checkout for ${this.formatedInput} </span>
                </ion-itext>
              </ion-item>
            )}
          </ion-card>
        </ion-col>
      </ion-row>
    ]
  }
}
