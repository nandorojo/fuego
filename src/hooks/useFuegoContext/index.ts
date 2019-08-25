import { useContext } from 'react'
import FuegoContext from '../../FuegoContext'

export default () => {
  // const { db, auth, addListener, removeListener, doesListenerExist, getListener } = useContext(
  // 	FuegoContext,
  // );
  // return { db, auth, addListener, removeListener, doesListenerExist, getListener };
  const context = useContext(FuegoContext)
  return context
}
