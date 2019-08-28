import { AuthGateOptions } from '../../HOC/connectFuegoGate/types'
import { ComponentType } from 'react'

export interface AuthGateProps extends AuthGateOptions {
  AuthComponent?: ComponentType
  beforeAuthUpdate?: (user: firebase.User | null) => any
}
