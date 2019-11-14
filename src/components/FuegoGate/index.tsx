import React, {
  useEffect,
  useState,
  FunctionComponent,
  ComponentType
} from 'react'
import firebase from 'firebase/app'
import { AuthGateProps } from './types'
import useFuegoContext from '../../hooks/useFuegoContext'

const AuthGate: FunctionComponent<AuthGateProps> = props => {
  const { LoadingComponent, displayName, photoURL } = props
  const [user, setUser] = useState<firebase.User | null | 'loading'>('loading')
  const context = useFuegoContext()
  const { auth } = context

  useEffect(() => {
    const unsubcribe = auth().onIdTokenChanged(u => {
      if (props.beforeAuthUpdate) props.beforeAuthUpdate(u)
      setUser(u)
    })
    return unsubcribe
  }, [])

  useEffect(() => {
    const start = async () => {
      try {
        if (!props.AuthComponent && props.signInAnonymously) {
          await auth().signInAnonymously()
          const { currentUser } = auth()
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

  if (user === 'loading') return LoadingComponent ? <LoadingComponent /> : null

  if (!user && props.AuthComponent) {
    const AuthComponent = props.AuthComponent as ComponentType

    return <AuthComponent {...context} {...props} />
  }

  return <>{props.children}</>
}

export default AuthGate
