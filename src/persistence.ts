import { firestore } from 'firebase/app'

export default async function(store: typeof firestore) {
  require('./persist-hack.js')
  return store().enablePersistence()
}
