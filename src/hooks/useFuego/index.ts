import useFuegoContext from '../useFuegoContext'
import { UseQueryConfig, QueryHookResponse, QueryDataHandler } from './types'
import { useEffect, useState, useRef } from 'react'
import FuegoQuery from '../../FuegoQuery'
import { FirestoreRefType, DocumentModel } from '../../FuegoQuery/types'
import { FuegoContextProps } from '../../FuegoContext/types'

function useFuego<DataModel extends DocumentModel>(
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
    const { db, removeListener } = context
    const [data, setDataState] = useState<QueryHookResponse<DataModel>['data']>(
        null
    )
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
        if (listen)
            unsubscribe.current = () => removeListener(listenerName.current)
        return () => {
            if (unsubscribeOnUnmount && listenerName.current) {
                ;(unsubscribe.current as () => FuegoContextProps['removeListener'])()
            }
        }
    }, [
        ...Object.keys(options).map(
            o => options[o as keyof QueryDataHandler<DataModel>]
        ),
        ...Object.keys(query).map(q => query[q as keyof UseQueryConfig])
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
