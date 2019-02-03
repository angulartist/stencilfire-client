/// <reference types="firebase" />

declare const db: firebase.firestore.Firestore

import { Component, State, Prop } from '@stencil/core'

// Helpers
import { emailRegex } from '../../helpers'
// Models
import { User } from '../../models'

@Component({
  tag: 'app-email',
  styleUrl: 'app-email.scss'
})
export class AppHome {
  @State() inputValue: string

  @Prop({ connect: 'ion-toast-controller' })
  toastCtrl: HTMLIonToastControllerElement

  // Props
  @Prop() currentUser: User

  async updateUserProfile() {
    try {
      const ref = db.doc(`users/${this.currentUser.id}`)
      await ref.update({ email: this.inputValue })
      this.notifyMe('Thanks! Your profile has been updated!', 'success')
    } catch (error) {
      this.notifyMe('Sorry, an error has occured', 'warning')
      throw new Error(`updateUserProfile: ${error}`)
    }
  }

  async notifyMe(message, color) {
    const toast = await this.toastCtrl.create({
      duration: 3000,
      message,
      color
    })

    toast.present()
  }

  handleSubmit(e) {
    e.preventDefault()
    if (emailRegex.test(this.inputValue)) {
      this.updateUserProfile()
    } else {
      this.notifyMe('Please check your email address', 'danger')
    }
  }

  handleChange(event) {
    this.inputValue = event.target.value
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color='tertiary'>
          <ion-title>Chests.io</ion-title>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <ion-grid>
          <ion-row justify-content-center>
            <ion-col size='12' size-md='8' size-lg='6'>
              <ion-card text-center>
                <img
                  padding-top
                  class='img--banner'
                  src='../../assets/images/mail.svg'
                  alt=''
                />
                <ion-card-header>
                  <ion-card-subtitle>Welcome</ion-card-subtitle>
                  <ion-card-title>One more step to go!</ion-card-title>
                </ion-card-header>
                <ion-card-content>
                  <p>
                    Lorem ipsum dolor sit amet consectetur, adipisicing elit.
                    Fugit omnis consequuntur animi cum cupiditate sunt fuga
                    itaque id amet! Cupiditate, esse officia perspiciatis
                    voluptatem sequi labore quam atque? In, velit?
                  </p>
                </ion-card-content>
                <form onSubmit={e => this.handleSubmit(e)}>
                  <ion-item mode='md' color='tertiary'>
                    <ion-input
                      placeholder='Enter your email address'
                      type='text'
                      value={this.inputValue}
                      onInput={event => this.handleChange(event)}
                    />
                    <ion-button fill='clear' size='default' type='submit'>
                      <ion-icon slot='icon-only' name='send' color='light' />
                    </ion-button>
                  </ion-item>
                </form>
              </ion-card>
            </ion-col>
          </ion-row>
        </ion-grid>

        {/* <form onSubmit={e => this.handleSubmit(e)}>
          <label>
            Name:
            <input
              type='text'
              value={this.nameValue}
              onInput={event => this.handleNameChange(event)}
            />
          </label>
          <label>
            Email:
            <input
              type='text'
              value={this.emailValue}
              onInput={event => this.handleEmailChange(event)}
            />
          </label>
          <input type='submit' value='Submit' />
        </form> */}
      </ion-content>
    ]
  }
}
