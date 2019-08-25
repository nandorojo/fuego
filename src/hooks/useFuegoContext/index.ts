import { useContext } from 'react'
import FuegoContext from '../../FuegoContext'
import { FuegoContextProps } from '../../FuegoContext/types'

export default () => {
  // const { db, auth, addListener, removeListener, doesListenerExist, getListener } = useContext(
  // 	FuegoContext,
  // );
  // return { db, auth, addListener, removeListener, doesListenerExist, getListener };
  const context: FuegoContextProps = useContext(FuegoContext)
  return context
}
