import { FuegoQueryConfig } from '../../FuegoQuery/types'
import { FirebaseError } from 'firebase'
import { FirestoreDbType } from '../../Fuego/types'

export interface UseQueryConfig extends FuegoQueryConfig {
  listen?: boolean
}

export type QueryDataModel = object[] | object | null

type Error = null | FirebaseError | string

export interface QueryHookResponse<DataModel> {
  data: DataModel | QueryDataModel
  loading: boolean
  error: Error
  db: FirestoreDbType
}

export interface QueryDataHandler<DataModel> {
  handleData?: (data: DataModel | QueryDataModel) => void
  handleLoading?: (loading: boolean) => void
  handleError?: (error: Error) => void
  // remove listener when the component unmounts
  unsubscribeOnUnmount?: boolean
}
