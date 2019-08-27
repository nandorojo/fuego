import { FuegoQueryConfig, FirestoreRefType } from '../../FuegoQuery/types'
import { FirebaseError } from 'firebase'
import { FirestoreDbType } from '../../Fuego/types'
// import { FuegoContextProps } from '../../../lib/typescript/FuegoContext/types.d'
import { FuegoContextProps } from '../../FuegoContext/types'

export interface UseQueryConfig extends FuegoQueryConfig {
  listen?: boolean
}

export type QueryDataModel = object[] | object | null

export type QueryError = null | FirebaseError | string

export interface QueryHookResponse<DataModel> {
  data: DataModel | QueryDataModel
  loading: boolean
  error: QueryError
  db: FirestoreDbType
  ref: FirestoreRefType
  unsubscribe: FuegoContextProps['removeListener']
}

export type HandleQueryData<DataModel> = (
  data: DataModel | QueryDataModel
) => void

export type HandleLoading = (loading: boolean) => void
export type HandleError = (error: QueryError) => void

export interface QueryDataHandler<DataModel> {
  handleData?: HandleQueryData<DataModel>
  handleLoading?: HandleLoading
  handleError?: HandleError
  // remove listener when the component unmounts
  unsubscribeOnUnmount?: boolean
  notifyOnNetworkStatusChange?: boolean
}
