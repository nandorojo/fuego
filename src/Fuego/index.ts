import * as firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'
import 'firebase/functions'
import { FuegoConfig } from './types'
import { FuegoContextProps } from '../FuegoContext/types'

export default class Fuego {
  public db: FuegoContextProps['db']
  public auth: FuegoContextProps['auth']
  public firebase: FuegoContextProps['firebase']
  public functions: FuegoContextProps['functions']

  constructor(config: FuegoConfig) {
    this.db = !firebase.apps.length
      ? firebase.initializeApp(config).firestore()
      : firebase.app().firestore()
    this.auth = firebase.auth
    this.firebase = firebase
    this.functions = firebase.functions
  }
}
