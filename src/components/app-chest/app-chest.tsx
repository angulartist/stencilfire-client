/// <reference types="firebase" />

declare const db: firebase.firestore.Firestore
declare const timestamp: firebase.firestore.Timestamp

import { Component, Prop, State } from '@stencil/core'
import { collectionData, docData } from 'rxfire/firestore'
import { Subject } from 'rxjs'
import { takeUntil } from 'rxjs/operators'
import { STATE, Chest, Attempt, User } from '../../models'

@Component({
  tag: 'app-chest',
  styleUrl: 'app-chest.scss'
})
export class AppChest {
  destroy$: Subject<boolean> = new Subject<boolean>()
  chestInput: HTMLIonInputElement
  userKey: string

  // States
  @State() chest: Chest
  @State() myAttempts: Attempt[]
  @State() myReward: any
  @State() noFoundChest: boolean = false

  // Props
  @Prop() chestId: string
  @Prop() currentUser: User

  componentWillLoad() {
    if (this.currentUser) {
      this.getChest()
      this.getMyAttempts()
    }
  }

  // Avoid memory leaks
  componentDidUnload() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  async getReward() {
    const ref = db.doc(`users/${this.currentUser.id}/chests/${this.chestId}`)
    const doc = await ref.get()
    this.myReward = doc.data()
  }

  getChest() {
    const ref = db.doc(`chests/${this.chestId}`)

    docData(ref, 'id')
      .pipe(takeUntil(this.destroy$))
      .subscribe((d: Chest) => {
        if (d.state) {
          this.chest = d
          this.noFoundChest = false
        } else {
          this.chest = {}
          this.noFoundChest = true
        }
      })
  }

  getMyAttempts() {
    const ref = db
      .collection('attempts')
      .where('userId', '==', this.currentUser.id)
      .where('chestId', '==', this.chestId)
      .orderBy('madeAt', 'desc')
      .limit(5)

    collectionData(ref, 'id')
      .pipe(takeUntil(this.destroy$))
      .subscribe((d: Attempt[]) => {
        this.myAttempts = d
        this.getReward()
      })
  }

  async tryUnlock(code: string) {
    if (code === 'Enter') {
      const ref = db.collection('attempts')

      this.chestInput.value = ''

      await ref.add({
        chestId: this.chestId,
        userId: this.currentUser.id,
        key: this.userKey,
        state: STATE.PROCESSING,
        madeAt: timestamp
      })
    }
  }

  updateInput({ value }) {
    this.userKey = value.trim()
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color='dark'>
          <ion-buttons slot='secondary'>
            <ion-button href='/'>
              <ion-icon slot='icon-only' name='home' />
            </ion-button>
          </ion-buttons>
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
          <ion-title>Chest ID:{this.chestId}</ion-title>
        </ion-toolbar>
      </ion-header>,
      <ion-content>
        {this.noFoundChest ? (
          <ion-text text-center color='danger'>
            <h4>Chest ID not found</h4>
          </ion-text>
        ) : null}
        <ion-grid>
          <ion-row justify-content-center>
            <ion-col size='12' size-md='8' size-lg='6' text-center>
              {this.chest && this.chest.id ? (
                <ion-card>
                  <ion-item text-center lines='none'>
                    <ion-text color='medium' slot='end'>
                      {this.chest.attempts
                        ? `${this.chest.attempts} keys failed`
                        : 'No keys used'}
                    </ion-text>
                    <ion-icon mode='md' name='key' slot='end' color='medium' />
                  </ion-item>
                  <ion-card-header>
                    {this.chest.isLocked ? (
                      <ion-card-subtitle color='danger'>
                        Locked
                      </ion-card-subtitle>
                    ) : (
                      <ion-card-subtitle color='success'>
                        First blood!
                      </ion-card-subtitle>
                    )}
                    <ion-card-title>{this.chest.title}</ion-card-title>
                  </ion-card-header>

                  <ion-card-content text-left>
                    <p>{this.chest.riddle}</p>
                  </ion-card-content>

                  {this.chest.isLocked ? (
                    [
                      <ion-item color='dark' mode='md'>
                        <ion-input
                          ref={(el: HTMLIonInputElement) =>
                            (this.chestInput = el)
                          }
                          onIonChange={({ detail }) => this.updateInput(detail)}
                          onKeyPress={({ code }) => this.tryUnlock(code)}
                          mode='md'
                          clearInput
                          type='text'
                          placeholder='Enter key'
                          minlength={1}
                        />
                      </ion-item>,
                      <div>
                        {this.myAttempts
                          ? this.myAttempts.map(attempt =>
                              attempt.state === STATE.PROCESSING ? (
                                <ion-item lines='full' color='primary'>
                                  {attempt.key}
                                  <ion-text slot='end'>Analyse...</ion-text>
                                </ion-item>
                              ) : attempt.state === STATE.SUCCESS ? (
                                <ion-item lines='full' color='success'>
                                  {attempt.key}
                                  <ion-text slot='end'>Success!</ion-text>
                                </ion-item>
                              ) : (
                                <ion-item lines='full' color='danger'>
                                  {attempt.key}
                                  <ion-text slot='end'>Failed</ion-text>
                                </ion-item>
                              )
                            )
                          : [<ion-spinner name='crescent' />]}
                      </div>
                    ]
                  ) : (
                    <div>
                      {this.chest.winnerId === this.currentUser.id ? (
                        <ion-item lines='none' color='success'>
                          <ion-label text-center>Good job!</ion-label>
                        </ion-item>
                      ) : (
                        <ion-item lines='none' color='warning'>
                          <ion-label text-center>Too late!</ion-label>
                        </ion-item>
                      )}
                    </div>
                  )}
                </ion-card>
              ) : (
                [<ion-spinner name='crescent' />]
              )}
            </ion-col>
            <ion-col size='12' size-md='8' size-lg='5' text-center>
              {this.myReward ? (
                <ion-card>
                  <ion-card-header>
                    <ion-card-subtitle color='warning'>
                      Reward
                    </ion-card-subtitle>

                    <ion-card-title>Grab it!</ion-card-title>
                  </ion-card-header>
                  <ion-card-content>{this.myReward.treasure}</ion-card-content>
                </ion-card>
              ) : (
                <ion-card>
                  <ion-card-header>
                    <ion-card-subtitle color='warning'>
                      Reward
                    </ion-card-subtitle>

                    <ion-card-title>Locked</ion-card-title>
                  </ion-card-header>
                </ion-card>
              )}
            </ion-col>
          </ion-row>
        </ion-grid>
      </ion-content>
    ]
  }
}
