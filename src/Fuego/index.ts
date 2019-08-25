import * as firebase from 'firebase'
import 'firebase/firestore'
import 'firebase/auth'
import { FuegoConfig } from './types'
import { FuegoContextProps } from '../FuegoContext/types'

export default class Fuego {
  // public db: firebase.firestore.Firestore
  public db: FuegoContextProps['db']
  public auth: FuegoContextProps['auth']
  public firebase: FuegoContextProps['firebase']

  constructor(config: FuegoConfig) {
    this.db = !firebase.apps.length
      ? firebase.initializeApp(config).firestore()
      : firebase.app().firestore()
    this.auth = firebase.auth
    this.firebase = firebase
  }
}
