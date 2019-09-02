import React, { FunctionComponent, useRef } from 'react'
import FuegoContext from '../FuegoContext'
import { FuegoContextProps } from '../FuegoContext/types'
import {
  FuegoProviderProps,
  FuegoProviderListeners,
  ListenerType
} from './types'

const FuegoProvider: FunctionComponent<FuegoProviderProps> = ({
  fuego,
  children
}) => {
  const listeners = useRef<FuegoProviderListeners>({})

  const addListener = (name: string, listener: () => void) => {
    listeners.current[name] = listener
    const numberOfListeners = Object.keys(listeners.current).filter(
      name => listeners.current[name] // listeners that exist
    ).length
    if (numberOfListeners >= 4)
      console.warn(
        'Fuego warning: too many listeners',
        `You currently have ${numberOfListeners} firestore listeners running. This can slow perfomance. Consider refactoring, or leaving the "unsubscribeOnUnmount" parameter set to true.`,
        "If you aren't sure what this error means, search for files that have the useFuego function, with the parameter listen: true"
      )
    return listeners.current[name]
  }

  const removeListener = (name: string) => {
    function listenerExists(listener: ListenerType): listener is () => void {
      return (
        !!listener &&
        !!(listener as () => void) &&
        typeof listener === 'function'
      )
    }
    if (listenerExists(listeners.current[name])) {
      ;(listeners.current[name] as () => void)()
      listeners.current[name] = null
    }
  }

  const doesListenerExist = (name: string) => {
    return !!listeners.current[name]
  }

  const getListener = (name: string) => {
    if (doesListenerExist(name)) return listeners.current[name]
    return null
  }

  const value: FuegoContextProps = {
    ...fuego,
    addListener,
    removeListener,
    doesListenerExist,
    getListener
  }
  return (
    <FuegoContext.Provider {...{ value }}>{children}</FuegoContext.Provider>
  )
}

export default FuegoProvider
