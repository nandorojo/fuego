import React, { useEffect, useState, FunctionComponent } from 'react'
import firebase from 'firebase'
import { AuthGateProps } from './types'

const AuthGate: FunctionComponent<AuthGateProps> = props => {
  const { LoadingComponent, displayName, photoURL } = props
  const [user, setUser] = useState<firebase.User | null | 'loading'>('loading')

  useEffect(() => {
    const unsubcribe = firebase.auth().onIdTokenChanged(u => {
      if (props.onAuthUpdate) props.onAuthUpdate(u)
      setUser(u)
    })
    return unsubcribe
  }, [])

  useEffect(() => {
    const start = async () => {
      try {
        if (!props.AuthComponent || props.signInAnonymously) {
          await firebase.auth().signInAnonymously()
          if (displayName || photoURL) {
            //   well this is just terrible but whatever fix later
            if (!photoURL) {
              await firebase.auth().currentUser.updateProfile({
                displayName
              })
            } else if (!displayName) {
              await firebase.auth().currentUser.updateProfile({
                photoURL
              })
            } else {
              await firebase.auth().currentUser.updateProfile({
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

  if (user === 'loading') return LoadingComponent ? <LoadingComponent /> : null

  const { AuthComponent } = props

  if (!user && props.AuthComponent) {
    return <AuthComponent {...firebase} {...props} />
  }

  return <>{props.children}</>
}

export default AuthGate
