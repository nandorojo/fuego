import connectFuego from './HOC/connectFuego/index'
import useFuego from './hooks/useFuego/index'
import FuegoProvider from './FuegoProvider/index'
import GetFuego from './components/GetFuego/index'
import Fuego from './Fuego/index'
import FuegoQuery from './FuegoQuery/index'
import * as QueryTypes from './FuegoQuery/types'

export { default as useFuegoContext } from './hooks/useFuegoContext'
export { default as useOnlineStatus } from './hooks/useOnlineStatus'
export { default as FuegoGate } from './components/FuegoGate'
export { default as connectFuegoGate } from './HOC/connectFuegoGate'
// export {
//     default as dangerouslyEnablePeristenceOnExpoAsync
// } from './persistence'

export {
  connectFuego,
  useFuego,
  FuegoProvider,
  GetFuego,
  Fuego,
  FuegoQuery,
  QueryTypes
}
