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
import { QueryDataModel } from '../hooks/useFuego/types'
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
  handleData: (data: DataModel | QueryDataModel) => void
  handleLoading: (loading: boolean) => void
  listen?: boolean
  context: FuegoContextProps
}

export type FirestoreRefType = DocumentReference | CollectionReference | Query
