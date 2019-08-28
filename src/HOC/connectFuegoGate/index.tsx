import React, { ComponentType } from 'react'
import { AuthGateOptions } from './types'
import AuthGate from '../../components/FuegoGate'

export default (
  AuthComponent?: ComponentType,
  options: AuthGateOptions = {}
) => {
  return (Component: ComponentType) => (
    <AuthGate {...options} AuthComponent={AuthComponent}>
      <Component />
    </AuthGate>
  )
}
