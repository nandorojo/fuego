import * as firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import { FuegoConfig } from './types'

export default class Fuego {
  public db: firebase.firestore.Firestore
  public auth: typeof firebase.auth
  public firebase: typeof firebase

  constructor(config: FuegoConfig) {
    this.db = !firebase.apps.length
      ? firebase.initializeApp(config).firestore()
      : firebase.app().firestore()
    this.auth = firebase.auth
    this.firebase = firebase
  }
}
