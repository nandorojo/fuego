import { ComponentType } from 'react'

export interface AuthGateOptions {
  signInAnonymously?: boolean
  LoadingComponent?: ComponentType
  /**
   * (Optional) A display name given to the user *if* the `signInAnonymously` prop is set to `true`.
   */
  displayName?: string
  photoURL?: string
}
