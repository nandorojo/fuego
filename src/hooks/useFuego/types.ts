import {
  FuegoQueryConfig,
  FirestoreRefType,
  DocumentModel
} from '../../FuegoQuery/types'
import { FirebaseError } from 'firebase/app'
import { FirestoreDbType } from '../../Fuego/types'
import { FuegoContextProps } from '../../FuegoContext/types'

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
  exists: null | boolean
  refetch: () => void
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
