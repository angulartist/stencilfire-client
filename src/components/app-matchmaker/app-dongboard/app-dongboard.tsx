/// <reference types="firebase" />

declare const db: firebase.firestore.Firestore

import { Component, State } from '@stencil/core'
import { collectionData } from 'rxfire/firestore'
import { takeUntil } from 'rxjs/operators'
import { Subject } from 'rxjs'

// Helpers
import { mmToCm, mmToInches } from '../../../helpers'

@Component({
  tag: 'app-dongboard',
  styleUrl: 'app-dongboard.scss'
})
export class AppDongboard {
  destroy$: Subject<boolean> = new Subject<boolean>()

  @State() users: any[]

  componentDidLoad() {
    this.watchUsers()
  }

  // Avoid memory leaks
  componentDidUnload() {
    this.destroy$.next(true)
    this.destroy$.unsubscribe()
  }

  watchUsers() {
    const usersQuery = db
      .collection('users')
      .where('dongSize', '>=', 1)
      .orderBy('dongSize', 'desc')

    collectionData(usersQuery, 'id')
      .pipe(takeUntil(this.destroy$))
      .subscribe(users => (this.users = users))
  }

  render() {
    return [
      <ion-row justify-content-center>
        <ion-col sizeMd='7' sizeLg='4'>
          <ion-card>
            <ion-card-header>
              <ion-card-subtitle>World</ion-card-subtitle>
              <ion-card-title>Dongboard</ion-card-title>
            </ion-card-header>
            <ion-list>
              <ion-list-header>
                <ion-label># Rank / SIZE</ion-label>
              </ion-list-header>
              {this.users &&
                this.users.map(({ dongSize, displayName, websiteUrl }, idx) => (
                  <div>
                    {idx === 0 ? (
                      <ion-item lines='none' color='secondary'>
                        <ion-label>
                          <h1>
                            <a href={websiteUrl} target='_blank'>
                              #{idx + 1} {displayName} <ion-icon name='link' />
                            </a>
                          </h1>
                          <p>
                            {mmToCm(dongSize)}cm ({mmToInches(dongSize)}
                            in)
                          </p>
                        </ion-label>
                        <ion-icon name='star' color='warning' />
                      </ion-item>
                    ) : (
                      <ion-item
                        lines='none'
                        color={idx % 2 === 0 ? 'light' : ''}
                      >
                        <ion-label>
                          <h2>
                            <a href={websiteUrl} target='_blank'>
                              #{idx + 1} {displayName} <ion-icon name='link' />
                            </a>
                          </h2>
                          <p>
                            {mmToCm(dongSize)}cm ({mmToInches(dongSize)}
                            in)
                          </p>
                        </ion-label>
                      </ion-item>
                    )}
                  </div>
                ))}
              {!this.users ? (
                <ion-item lines='none'>
                  <ion-label text-center>
                    <ion-spinner color='medium' name='lines-small' />
                  </ion-label>
                </ion-item>
              ) : null}
            </ion-list>
          </ion-card>
        </ion-col>
      </ion-row>
    ]
  }
}
