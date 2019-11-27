import {
  WhereFilterOp,
  OrderByDirection,
  FieldPath,
  DocumentReference,
  CollectionReference,
  Query,
  DocumentSnapshot,
  DocumentData
} from '@firebase/firestore-types'
import { FirestoreDbType } from '../Fuego/types'
import {
  HandleQueryData,
  HandleLoading,
  HandleError
} from '../hooks/useFuego/types'
import { FuegoContextProps } from '../FuegoContext/types'
import { Dispatch, SetStateAction } from 'react'

export type OrderByArray = [string | FieldPath, OrderByDirection]
export type OrderByItem = OrderByArray | string
export type OrderByType = OrderByItem | OrderByArray[]

type PathType = string

type WhereCondition = WhereFilterOp

export type WhereItem = [string | FieldPath, WhereCondition, any]
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

export interface HandleQueryConfig<DataModel extends DocumentModel> {
  db: FirestoreDbType
  handleData: HandleQueryData<DataModel>
  handleLoading: HandleLoading
  listen?: boolean
  context: FuegoContextProps
}

export type FirestoreRefType = DocumentReference | CollectionReference | Query

export interface DocumentModel extends DocumentData {
  id: string
}

export type CollectionModel = DocumentModel[]

// export type FirestoreDataModel = DocumentModel | CollectionModel
export type FirestoreDataModel = DocumentModel | CollectionModel

export interface FuegoQueryInitType<DataModel extends DocumentModel> {
  listenerNameRef: React.MutableRefObject<string>
  dbRef: React.MutableRefObject<FirestoreRefType | null>
  notifyOnNetworkStatusChange?: boolean
  setData:
    | HandleQueryData<DataModel>
    | Dispatch<SetStateAction<DataModel | DataModel[] | null>>
  setLoading: HandleLoading
  setError: HandleError
  context: FuegoContextProps
  listen?: boolean
  setExists: (exists: boolean) => void
}
