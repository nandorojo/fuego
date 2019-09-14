import { AuthGateOptions } from '../../HOC/connectFuegoGate/types'
import { ComponentType } from 'react'

export interface AuthGateProps extends AuthGateOptions {
  /**
   * A react component to render when loading has completed and the user is not currently signed in. This is where you insert your own auth flow component.
   *
   * @example
   * ```javascript
   * import SignInStack from './path/to/SignInStack'
   *
   *
   * return <FuegoGate AuthComponent={SignInStack} />
   * ```
   */
  AuthComponent?: ComponentType
  beforeAuthUpdate?: (user: firebase.User | null) => any
}
