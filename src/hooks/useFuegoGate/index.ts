import { useState, useEffect } from 'react'
import firebase from 'firebase/app'
import { AuthGateProps } from '../../components/FuegoGate/types'

// TODO this is fucked, redo it for hooks
export default function(props: AuthGateProps) {
  const [user, setUser] = useState<firebase.User | null | 'loading'>('loading')

  const { displayName, photoURL } = props

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
  }, [props.signInAnonymously, displayName, photoURL, props.AuthComponent])
  return {}
}
