import useFuegoContext from '../useFuegoContext'
import {
  UseQueryConfig,
  QueryDataModel,
  QueryHookResponse,
  QueryDataHandler
} from './types'
import { useEffect, useState, useRef } from 'react'
import FuegoQuery from '../../FuegoQuery'
import {
  DocumentReference,
  CollectionReference
} from '@firebase/firestore-types'
import { FirestoreRefType } from '../../FuegoQuery/types'

function useFuego<DataModel>(
  { path, where, orderBy, limit, listen = false }: UseQueryConfig,
  {
    handleData,
    handleLoading,
    handleError,
    unsubscribeOnUnmount = true
  }: QueryDataHandler<DataModel> = {}
): QueryHookResponse<DataModel> {
  const {
    db,
    addListener,
    removeListener,
    doesListenerExist,
    getListener
  } = useFuegoContext()
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
  const ref = useRef<FirestoreRefType>()

  useEffect(() => {
    let listenerName = ''

    const init = async () => {
      try {
        if (!path) {
          return console.warn(
            'You called the useFuego hook without providing a path. \nIf you want access to the firestore db object, try using useFuegoContext() instead.'
          )
        }
        const query = new FuegoQuery({ path, where, orderBy, limit })
        listenerName = query.getQueryStringId()
        const { isDocument, ref: dbRef } = query.getRef(db)
        ref.current = dbRef

        if (!listen) {
          if (isDocument) {
            const doc = await (ref.current as DocumentReference).get()
            setData({
              ...doc.data(),
              id: doc.id
            })
          } else {
            const response = await (ref.current as CollectionReference).get()
            const r: object[] = []
            response.forEach(doc => r.push({ ...doc.data(), id: doc.id }))
            setData(r)
          }
          setLoading(false)
        } else {
          const listenerExists = doesListenerExist(listenerName)
          if (listenerExists) {
            getListener(listenerName)
          } else if (isDocument) {
            addListener(
              listenerName,
              (ref.current as DocumentReference).onSnapshot((doc: any) => {
                setData({ ...doc.data(), id: doc.id })
                setLoading(false)
              })
            )
          } else {
            addListener(
              listenerName,
              (ref.current as CollectionReference).onSnapshot(querySnapshot => {
                const array: object[] = []
                querySnapshot.forEach(doc => {
                  array.push({
                    ...doc.data(),
                    id: doc.id
                  })
                })
                setData(array as object[])
                setLoading(false)
              })
            )
          }
        }
      } catch (e) {
        setError(e)
        console.error(
          'fuego error: \nuseFuego failed. \nError: ',
          JSON.stringify(e)
        )
      }
    }
    init()
    return () => {
      if (unsubscribeOnUnmount) {
        removeListener(listenerName)
      }
    }
  }, [path, listen, where, orderBy])

  return { data, loading, error, db, ref: ref.current as FirestoreRefType }
}

export default useFuego
