import { ComponentType } from 'react'

export interface AuthGateOptions {
  signInAnonymously?: boolean
  LoadingComponent?: ComponentType
  displayName?: string
  photoURL?: string
}
