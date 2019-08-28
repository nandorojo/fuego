import { useState, useEffect } from 'react'
import firebase from 'firebase'

export default function() {
  const [user, setUser] = useState<firebase.User | null | 'loading'>('loading')

  useEffect(() => {
    const unsubcribe = firebase.auth().onIdTokenChanged(u => {
      if (props.beforeAuthUpdate) props.beforeAuthUpdate(u)
      setUser(u)
    })
    return unsubcribe
  }, [])

  useEffect(() => {
    const start = async () => {
      try {
        if (!props.AuthComponent || props.signInAnonymously) {
          await firebase.auth().signInAnonymously()
          const { currentUser } = firebase.auth()
          if (displayName || currentUser) {
            //   well this is just terrible but whatever fix later
            if (!photoURL) {
              await (currentUser as firebase.User).updateProfile({
                displayName
              })
            } else if (!displayName) {
              await (currentUser as firebase.User).updateProfile({
                photoURL
              })
            } else {
              await (currentUser as firebase.User).updateProfile({
                photoURL,
                displayName
              })
            }
          }
        }
      } catch (e) {
        console.error('fuego AuthGate sign in error', e)
      }
    }
    start()
  }, [
    props.signInAnonymously,
    props.displayName,
    props.photoURL,
    props.AuthComponent
  ])
  return {}
}
