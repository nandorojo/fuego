import { FirestoreDbType } from '../Fuego/types'
import firebase, { functions } from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

export interface FuegoContextProps {
  db: FirestoreDbType
  auth: typeof firebase.auth
  firebase: typeof firebase
  functions: typeof functions
  addListener: (name: string, listener: () => void) => void
  removeListener: (name: string) => void
  doesListenerExist: (name: string) => boolean
  getListener: (name: string) => (() => void) | null
}
