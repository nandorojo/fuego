import { firestore } from 'firebase'

export default async function(store: typeof firestore) {
  require('../persist-hack.js')
  return store().enablePersistence()
}
