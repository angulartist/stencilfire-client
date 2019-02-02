/// <reference types="firebase" />

declare const db: firebase.firestore.Firestore

import { Component, State, Prop } from '@stencil/core'
import { Subscription } from 'rxjs'
import { collectionData } from 'rxfire/firestore'
import { User, Chest } from '../../models'

@Component({
  tag: 'app-start',
  styleUrl: 'app-start.scss'
})
export class AppStart {
  userInput: HTMLInputElement
  chests$: Subscription

  // Props
  @Prop() currentUser: User

  // States
  @State() chests: Chest[]

  componentWillLoad() {
    this.getChests()
  }

  // Avoid memory leaks
  componentDidUnload() {
    if (typeof this.chests$ !== 'undefined') {
      this.chests$.unsubscribe()
    }
  }

  getChests() {
    const ref = db.collection('chests').where('state', '==', 1)

    this.chests$ = collectionData(ref, 'id').subscribe(d => (this.chests = d))
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color='dark'>
          <ion-buttons slot='primary'>
            <ion-button>
              <ion-icon mode='md' slot='end' name='key' />
              {this.currentUser
                ? this.currentUser.attemptsLeft
                  ? this.currentUser.attemptsLeft
                  : 0
                : 0}
            </ion-button>
          </ion-buttons>
          <ion-title>Chests.io (alpha)</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content padding>
        <ion-text color='medium' text-center>
          <h1>Locked chests</h1>
        </ion-text>
        <ion-grid>
          <ion-row justify-content-center>
            {this.chests ? (
              this.chests.map(chest => (
                <ion-col size='12' size-sm='6' size-md='4'>
                  <ion-card text-center>
                    <ion-card-header>
                      {chest.isLocked ? (
                        <ion-card-subtitle color='danger'>
                          Locked
                        </ion-card-subtitle>
                      ) : (
                        <ion-card-subtitle color='success'>
                          First blood!
                        </ion-card-subtitle>
                      )}
                      <ion-card-title>{chest.title}</ion-card-title>
                    </ion-card-header>

                    <ion-card-content>
                      {chest.attempts ? (
                        <span>{chest.attempts} keys failed</span>
                      ) : (
                        <span>No keys used</span>
                      )}
                    </ion-card-content>
                    <ion-item
                      lines='none'
                      href={`/chest/${chest.id}`}
                      color='tertiary'
                    >
                      <ion-icon name='lock' slot='start' />
                      <ion-label>Try to unlock</ion-label>
                    </ion-item>
                  </ion-card>
                </ion-col>
              ))
            ) : (
              <ion-spinner name='crescent' />
            )}
          </ion-row>
        </ion-grid>
      </ion-content>
    ]
  }
}
