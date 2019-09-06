import useFuegoContext from '../useFuegoContext'
import {
  UseQueryConfig,
  QueryDataModel,
  QueryHookResponse,
  QueryDataHandler
} from './types'
import { useEffect, useState, useRef } from 'react'
import FuegoQuery from '../../FuegoQuery'
// import {
//   DocumentReference,
//   CollectionReference
// } from '@firebase/firestore-types'
import { FirestoreRefType } from '../../FuegoQuery/types'
import { FuegoContextProps } from '../../FuegoContext/types'

function useFuego<DataModel>(
  query: UseQueryConfig,
  options: QueryDataHandler<DataModel> = {}
): QueryHookResponse<DataModel> {
  const {
    // path,
    listen = false
  } = query
  const {
    handleData,
    handleLoading,
    handleError,
    unsubscribeOnUnmount = true,
    notifyOnNetworkStatusChange = true
  } = options
  const context = useFuegoContext()
  const {
    db,
    removeListener
    // addListener,
    // doesListenerExist,
    // getListener
  } = context
  const [data, setDataState] = useState<DataModel | QueryDataModel>(null)
  const [loading, setLoadingState] = useState(true)
  const [error, setErrorState] = useState<
    QueryHookResponse<DataModel>['error']
  >(null)

  const [setData, setLoading, setError] = [
    handleData || setDataState,
    handleLoading || setLoadingState,
    handleError || setErrorState
  ]

  // ref generated from the query
  const ref = useRef<FirestoreRefType | null>(null)
  const listenerName = useRef('')
  const unsubscribe = useRef<
    () => void | (() => FuegoContextProps['removeListener'])
  >(() => {})

  useEffect(() => {
    new FuegoQuery(query).handle<DataModel>({
      listen,
      notifyOnNetworkStatusChange,
      setData,
      setLoading,
      setError,
      listenerNameRef: listenerName,
      dbRef: ref,
      context
    })
    if (listen) unsubscribe.current = () => removeListener(listenerName.current)
    // const init = async () => {
    //   try {
    //     if (!path) {
    //       return console.warn(
    //         'You called the useFuego hook without providing a path. \nIf you want access to the firestore db object, try using useFuegoContext() instead.'
    //       )
    //     }
    //     const fuego = new FuegoQuery(query)
    //     listenerName.current = fuego.getQueryStringId()
    //     const { isDocument, ref: dbRef } = fuego.getRef(db)
    //     ref.current = dbRef

    //     if (!listen) {
    //       if (isDocument) {
    //         const doc = await (ref.current as DocumentReference).get()
    //         setData({
    //           ...doc.data(),
    //           id: doc.id
    //         })
    //       } else {
    //         const response = await (ref.current as CollectionReference).get()
    //         const r: object[] = []
    //         response.forEach(doc => r.push({ ...doc.data(), id: doc.id }))
    //         setData(r)
    //       }
    //       if (notifyOnNetworkStatusChange) setLoading(false)
    //     } else {
    //       const listenerExists = doesListenerExist(listenerName.current)
    //       if (listenerExists) {
    //         getListener(listenerName.current)
    //       } else if (isDocument) {
    //         addListener(
    //           listenerName.current,
    //           (ref.current as DocumentReference).onSnapshot((doc: any) => {
    //             setData({ ...doc.data(), id: doc.id })
    //             if (notifyOnNetworkStatusChange) setLoading(false)
    //           })
    //         )
    //       } else {
    //         addListener(
    //           listenerName.current,
    //           (ref.current as CollectionReference).onSnapshot(querySnapshot => {
    //             const array: object[] = []
    //             querySnapshot.forEach(doc => {
    //               array.push({
    //                 ...doc.data(),
    //                 id: doc.id
    //               })
    //             })
    //             setData(array as object[])
    //             if (notifyOnNetworkStatusChange) setLoading(false)
    //           })
    //         )
    //       }
    //     }
    //   } catch (e) {
    //     setError(e)
    //     console.error(
    //       'fuego error: \nuseFuego failed. \nError: ',
    //       JSON.stringify(e)
    //     )
    //   }
    // }
    // init()
    return () => {
      if (unsubscribeOnUnmount && listenerName) {
        // removeListener(listenerName.current)
        ;(unsubscribe.current as () => FuegoContextProps['removeListener'])()
      }
    }
  }, [
    // ...Object.keys(query).map(opt => query[opt as keyof UseQueryConfig]),
    // ...Object.keys(options).map(
    //   opt => options[opt as keyof QueryDataHandler<DataModel>]
    // )
    ...Object.keys(options),
    ...Object.keys(query)
  ])

  return {
    data,
    loading,
    error,
    db,
    ref: ref.current as FirestoreRefType,
    unsubscribe: unsubscribe.current as FuegoContextProps['removeListener']
  }
}

export default useFuego
