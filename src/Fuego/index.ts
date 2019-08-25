import * as firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import { FuegoConfig } from './types'

export default class Fuego {
  public db: firebase.firestore.Firestore
  public auth: firebase.auth.Auth
  public firebase: any

  constructor(config: FuegoConfig) {
    this.db = !firebase.apps.length
      ? firebase.initializeApp(config).firestore()
      : firebase.app().firestore()
    this.auth = firebase.auth()
    this.firebase = firebase
  }
}
