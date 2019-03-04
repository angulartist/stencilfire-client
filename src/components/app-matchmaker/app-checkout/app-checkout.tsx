/// <reference types="firebase" />

declare const fn: firebase.functions.Functions
declare const Stripe: any

import { Component, Prop, State } from '@stencil/core'
import { Subject } from 'rxjs'
import { mmToInches, mmToCm } from '../../../helpers'

// STYLES
const payHeaderStyle = {
  fontWeight: 'bolder'
}

const aboutSales = {
  fontSize: '0.9em',
  color: '#a1a1a1'
}

const checkoutStyle = {
  fontSize: '1.3em'
}

const labelStyle = {
  color: '#6b7c93',
  fontWeight: 'bolder',
  fontSize: '0.9em'
}

const formHolder = {
  padding: '0 5px'
}

type ToastType = 'success' | 'light'

@Component({
  tag: 'app-checkout',
  styleUrl: 'app-checkout.scss'
})
export class AppCheckout {
  modalController = document.querySelector('ion-modal-controller')
  destroy$: Subject<boolean> = new Subject<boolean>()

  // [STRIPE]
  stripe = Stripe('xxx')
  elements = this.stripe.elements()
  style = {
    base: {
      color: '#32325d',
      fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      }
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
  card = this.elements.create('card', { style: this.style })

  // [CALLABLE FN]
  sourceFn = fn.httpsCallable('stripeAttachSource')
  chargeFn = fn.httpsCallable('stripeCreateCharge')

  inputName: string
  inputDomain: string

  @State() isProcessing: boolean = false

  @Prop() currentUser: any
  @Prop() billingAmount: number
  @Prop() formatedInput: number
  @Prop({ connect: 'ion-toast-controller' })
  toastController: HTMLIonToastControllerElement

  componentDidLoad() {
    setTimeout(() => {
      this.card.mount('#card-element')
    }, 500)
  }

  // Avoid memory leaks
  componentDidUnload() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  closeCheckout() {
    return this.modalController.dismiss()
  }

  handleInputName(event: CustomEvent) {
    this.inputName = event.detail.value.trim()
  }

  handleInputDomain(event: CustomEvent) {
    this.inputDomain = event.detail.value.trim()
  }

  async processCharge() {
    if (!this.isValidName) {
      this.presentToast('Name length should be between 1 andd 120.', 'light')
      throw new Error('Name not valid.')
    }

    this.isProcessing = true

    const { source, error } = await this.stripe.createSource(this.card)

    if (error) {
      this.isProcessing = false
      this.presentToast('Card is not valid.', 'light')
      throw new Error(error)
    } else {
      return this.handleBilling(source)
    }
  }

  async handleBilling({ id: source }) {
    try {
      console.log('try')

      await this.sourceFn({ source })
      console.log('passed')
      await this.chargeFn({
        source,
        amount: this.billingAmount,
        displayName: this.displayName,
        websiteUrl: this.inputDomain
      })

      this.presentToast(
        'Thank you!  🎉🎉🎉 Your e-penis is longer right now.',
        'success',
        5000
      )

      this.closeCheckout()
    } catch (error) {
      this.presentToast(
        'Oh ohh... Payment has been rejected. Try later.',
        'light',
        3500
      )
    }

    this.isProcessing = false
  }

  async presentToast(message: string, color: ToastType, duration = 1500) {
    const toast = await this.toastController.create({
      position: 'bottom',
      duration,
      message,
      color
    })

    toast.present()
  }

  get isValidName() {
    return (
      this.inputName &&
      this.inputName.trim() &&
      this.inputName.trim().length > 0 &&
      this.inputName.trim().length < 120
    )
  }

  get displayName() {
    if (this.isValidName) return this.inputName
  }

  render() {
    return [
      <ion-item lines='none' color='tertiary'>
        <ion-text style={payHeaderStyle}>
          Buying {mmToCm(this.billingAmount)}cm (
          {mmToInches(this.billingAmount)}in)
        </ion-text>
      </ion-item>,
      <ion-content>
        <ion-grid>
          <ion-row justify-content-center>
            <ion-col>
              <div style={formHolder}>
                <div>
                  <label style={labelStyle}>Name*</label>
                  <ion-input
                    autofocus
                    required
                    maxlength={120}
                    type='text'
                    placeholder='John Doe'
                    onIonChange={event => this.handleInputName(event)}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Website</label>
                  <ion-input
                    type='url'
                    placeholder='mydomain.com'
                    onIonChange={event => this.handleInputDomain(event)}
                  />
                </div>
              </div>
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>,
      <ion-item lines='inset'>
        <div class='form-row'>
          <label style={labelStyle}>Payement*</label>
          <div id='card-element' />

          <div id='card-errors' role='alert' />
        </div>
      </ion-item>,
      <ion-item lines='none' text-center>
        <ion-text style={aboutSales}>
          All sales are final. Secured with Stripe.
        </ion-text>
        <ion-button
          fill='outline'
          size='small'
          slot='end'
          color='tertiary'
          onClick={() => this.processCharge()}
        >
          <ion-text style={checkoutStyle}>Pay ${this.formatedInput}</ion-text>
        </ion-button>
      </ion-item>,
      <div>
        {this.isProcessing ? (
          <ion-progress-bar
            type='indeterminate'
            buffer={0.4}
            color='tertiary'
            mode='md'
          />
        ) : (
          <ion-progress-bar buffer={0.4} color='light' mode='md' />
        )}
      </div>,
      <ion-fab vertical='top' horizontal='end' slot='fixed'>
        <ion-fab-button
          color='light'
          type='submit'
          onClick={() => this.closeCheckout()}
        >
          <ion-icon name='close' />
        </ion-fab-button>
      </ion-fab>
    ]
  }
}
