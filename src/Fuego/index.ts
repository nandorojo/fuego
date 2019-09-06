import * as firebase from 'firebase'
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
    const app = !firebase.apps.length
      ? firebase.initializeApp(config)
      : firebase.app()
    this.functions = firebase.functions
    this.db = app.firestore()
    this.auth = firebase.auth
    this.firebase = firebase
  }
  async dangerouslyEnablePeristenceOnExpoAsync() {
    require('../persist-hack')
    return this.firebase.firestore().enablePersistence()
  }
}
