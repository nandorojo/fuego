import {
    FuegoQueryConfig,
    FirestoreRefType,
    FirestoreDataModel,
    DocumentModel
} from '../../FuegoQuery/types'
import { FirebaseError } from 'firebase'
import { FirestoreDbType } from '../../Fuego/types'
// import { FuegoContextProps } from '../../../lib/typescript/FuegoContext/types.d'
import { FuegoContextProps } from '../../FuegoContext/types'
import { Dispatch, SetStateAction } from 'react'

export interface UseQueryConfig extends FuegoQueryConfig {
    listen?: boolean
}

export type QueryDataModel = object[] | object | null

export type QueryError = null | FirebaseError | string

export interface QueryHookResponse<DataModel> {
    data: DataModel | DataModel[] | null
    loading: boolean
    error: QueryError
    db: FirestoreDbType
    ref: FirestoreRefType
    unsubscribe: FuegoContextProps['removeListener']
}

export type HandleQueryData<
    DataModel extends DocumentModel
    // CollectionDataModel extends DocumentModel[]
> = (data: DataModel | DataModel[] | null) => void

export type HandleLoading = (loading: boolean) => void
export type HandleError = (error: QueryError) => void

export interface QueryDataHandler<DataModel extends DocumentModel> {
    handleData?: HandleQueryData<DataModel>
    handleLoading?: HandleLoading
    handleError?: HandleError
    // remove listener when the component unmounts
    unsubscribeOnUnmount?: boolean
    notifyOnNetworkStatusChange?: boolean
}
