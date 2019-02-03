/// <reference types="firebase" />

declare const db: firebase.firestore.Firestore

import { Component, State, Prop } from '@stencil/core'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { collectionData } from 'rxfire/firestore'
import { User, Chest, STATE } from '../../models'

@Component({
  tag: 'app-start',
  styleUrl: 'app-start.scss'
})
export class AppStart {
  destroy$: Subject<boolean> = new Subject<boolean>()
  userInput: HTMLInputElement

  // States
  @State() chests: Chest[]

  // Props
  @Prop() currentUser: User

  componentWillLoad() {
    if (this.currentUser) {
      this.getChests()
    }
  }

  // Avoid memory leaks
  componentDidUnload() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  getChests() {
    const ref = db.collection('chests').where('state', '==', STATE.SUCCESS)

    collectionData(ref, 'id')
      .pipe(takeUntil(this.destroy$))
      .subscribe(d => (this.chests = d))
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color='dark'>
          <ion-buttons slot='primary'>
            <ion-button>
              <ion-icon mode='md' slot='end' name='key' />
              {this.currentUser ? (
                this.currentUser.attemptsLeft > 0 ? (
                  this.currentUser.attemptsLeft
                ) : (
                  <ion-text color='danger'>Out of keys</ion-text>
                )
              ) : (
                'Connecting...'
              )}
            </ion-button>
          </ion-buttons>
          <ion-title>Chests.io (alpha)</ion-title>
        </ion-toolbar>
        <ion-toolbar>
          <ion-title>Home</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        <ion-text color='medium' text-center>
          <h1>Locked chests</h1>
        </ion-text>
        <ion-grid>
          <ion-row justify-content-center>
            {this.chests ? (
              this.chests.map(chest => (
                <ion-col size='12' size-md='6' size-lg='5'>
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
