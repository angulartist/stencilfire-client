import { Component } from '@stencil/core'

const titleStyle = {
  color: '#556cd6',
  fontWeight: 'bolder',
  fontSize: '2em'
}

const subTitleStyle = {
  color: '#697386',
  fontWeight: 'bold'
}

@Component({
  tag: 'app-header'
})
export class AppHeader {
  render() {
    return [
      <ion-text text-center>
        <h1 style={titleStyle}>Who has the longest dong? 🍆</h1>
        <h4 style={subTitleStyle}>1mm = 1 cent. Dominate. 👑</h4>
      </ion-text>
    ]
  }
}
