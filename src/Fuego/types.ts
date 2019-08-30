export interface FuegoConfig {
  apiKey: string
  authDomain: string
  databaseURL: string
  projectId: string
  storageBucket: string
  messagingSenderId: string
  appId?: string
}

export type FirestoreDbType = firebase.firestore.Firestore

export interface FuegoType {
  db: firebase.firestore.Firestore
}
