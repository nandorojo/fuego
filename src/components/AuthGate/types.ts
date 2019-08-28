import { AuthGateOptions } from '../../HOC/authGate/types'
import { ComponentType } from 'react'

export interface AuthGateProps extends AuthGateOptions {
  AuthComponent: ComponentType
  beforeAuthUpdate?: (user: firebase.User | null) => any
}
