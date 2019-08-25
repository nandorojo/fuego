import {
  WhereFilterOp,
  OrderByDirection,
  FieldPath,
  DocumentReference,
  CollectionReference,
  Query,
  DocumentSnapshot
} from '@firebase/firestore-types'
import { FirestoreDbType } from '../Fuego/types'
import {
  QueryDataModel,
  HandleQueryData,
  HandleLoading,
  HandleError
} from '../hooks/useFuego/types'
import { FuegoContextProps } from '../FuegoContext/types'

export type OrderByArray = [string | FieldPath, OrderByDirection]
export type OrderByItem = OrderByArray | string
export type OrderByType = OrderByItem | OrderByArray[]

type PathType = string

type WhereCondition = WhereFilterOp

export type WhereItem = [string, WhereCondition, string]
export type WhereArray = WhereItem[]
export type WhereType = WhereItem | WhereArray

export type FuegoQueryConfig = {
  path: PathType
  orderBy?: OrderByType
  where?: WhereType
  limit?: number
  startAt?: number | DocumentSnapshot
  endAt?: number | DocumentSnapshot
  startAfter?: number | DocumentSnapshot
  endBefore?: number | DocumentSnapshot
}

export interface HandleQueryConfig<DataModel> {
  db: FirestoreDbType
  handleData: HandleQueryData<DataModel>
  handleLoading: HandleLoading
  listen?: boolean
  context: FuegoContextProps
}

export type FirestoreRefType = DocumentReference | CollectionReference | Query

export interface FuegoQueryInitType<DataModel> {
  listenerNameRef: React.MutableRefObject<string>
  dbRef: React.MutableRefObject<FirestoreRefType | null>
  notifyOnNetworkStatusChange?: boolean
  setData: HandleQueryData<DataModel>
  setLoading: HandleLoading
  setError: HandleError
  context: FuegoContextProps
  listen?: boolean
}
