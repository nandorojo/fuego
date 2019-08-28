import { AuthGateOptions } from '../../HOC/authGate/types'
import { ComponentType } from 'react'

export interface AuthGateProps extends AuthGateOptions {
  AuthComponent: ComponentType
  onAuthUpdate?: (user: firebase.User | null) => any
}
