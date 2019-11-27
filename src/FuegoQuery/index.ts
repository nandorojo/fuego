import {
  FuegoQueryConfig,
  OrderByArray,
  WhereItem,
  WhereType,
  WhereArray,
  OrderByType,
  FirestoreRefType,
  FuegoQueryInitType,
  DocumentModel
} from './types'
import { FirestoreDbType } from '../Fuego/types'
import {
  CollectionReference,
  DocumentReference,
  DocumentSnapshot,
  QuerySnapshot
} from '@firebase/firestore-types'

export default class {
  private config: FuegoQueryConfig

  constructor(config: FuegoQueryConfig) {
    this.config = config
  }

  getRef(db: FirestoreDbType) {
    let ref: FirestoreRefType | null = null
    const {
      path,
      where,
      orderBy,
      limit,
      startAt,
      endAt,
      startAfter,
      endBefore
    } = this.config

    let isDocument = false
    try {
      if (!path)
        throw new Error('Empty path supplied to getRef in FuegoQuery class')
      isDocument = path.split('/').filter(Boolean).length % 2 === 0

      if (isDocument) {
        ref = db.doc(path)
      } else {
        ref = db.collection(path)
        if (where) {
          function multipleConditions(w: WhereType): w is WhereArray {
            // return Array.isArray((w as WhereArray)[0])
            return !!(w as WhereArray) && Array.isArray(w[0])
          }
          if (multipleConditions(where)) {
            ;(where as WhereArray).forEach((w: WhereItem) => {
              ref = (ref as CollectionReference).where(w[0], w[1], w[2])
            })
          } else if (
            typeof where[0] === 'string' &&
            typeof where[1] === 'string'
          ) {
            ref = (ref as CollectionReference).where(
              where[0],
              where[1],
              where[2]
            )
          }
        }
        if (orderBy) {
          if (typeof orderBy === 'string') {
            ref = ref.orderBy(orderBy)
          } else if (Array.isArray(orderBy)) {
            function multipleOrderBy(o: OrderByType): o is OrderByArray[] {
              return Array.isArray((o as OrderByArray[])[0])
            }
            if (multipleOrderBy(orderBy)) {
              ;(orderBy as OrderByArray[]).forEach((order: OrderByArray) => {
                ref = (ref as CollectionReference).orderBy(...order)
              })
            } else {
              const [order, direction] = orderBy as OrderByArray
              ref = ref.orderBy(order, direction)
            }
          }
        }
        if (startAt) {
          ref = ref.startAt(startAt)
        }
        if (endAt) {
          ref = ref.endAt(endAt)
        }
        if (startAfter) {
          ref = ref.startAfter(startAfter)
        }
        if (endBefore) {
          ref = ref.endBefore(endBefore)
        }
        if (limit) {
          ref = ref.limit(limit)
        }
      }
    } catch (e) {
      // ref = null;
      console.error(e)
    }
    return { ref, isDocument }
  }
  getQueryStringId() {
    return JSON.stringify(
      Object.keys(this.config)
        .sort()
        .map(configType => {
          return {
            [configType]: this.config[configType as keyof FuegoQueryConfig]
          }
        })
    )
  }
  async handle<DataModel extends DocumentModel>({
    listenerNameRef,
    context,
    dbRef,
    listen = false,
    notifyOnNetworkStatusChange = true,
    setData,
    setLoading,
    setError,
    setExists
  }: FuegoQueryInitType<DataModel>) {
    const { path } = this.config
    try {
      if (!path) {
        return console.warn(
          'You called the useFuego hook without providing a path. \nIf you want access to the firestore db object, try using useFuegoContext() instead.'
        )
      }
      if (!context)
        throw new Error(
          'missing context from firestore query handler. check useFuego'
        )
      const { db, addListener, doesListenerExist, getListener } = context
      listenerNameRef.current = this.getQueryStringId()
      const { isDocument, ref } = this.getRef(db)
      dbRef.current = ref

      if (!listen) {
        if (isDocument) {
          const doc = await (dbRef.current as DocumentReference).get()
          setExists(doc.exists)
          if (doc.exists) {
            setData({
              ...doc.data({ serverTimestamps: 'estimate' }),
              id: doc.id
            } as DataModel)
          }
        } else {
          const response = await (dbRef.current as CollectionReference).get()
          // const r: object[] = []
          const r: DataModel[] = []
          response.forEach(doc =>
            r.push({
              ...doc.data({ serverTimestamps: 'estimate' }),
              id: doc.id
            } as DataModel)
          )
          setExists(!response.empty)
          if (!response.empty) {
            setData(r)
          }
        }
        if (notifyOnNetworkStatusChange) setLoading(false)
      } else {
        const listenerExists = doesListenerExist(listenerNameRef.current)
        if (listenerExists) {
          console.warn(
            "Warning, you're trying to initialize the same listener twice. This applies to the firestore query: ",
            this.config.path
          )
          // TODO fix this issue where having a listener already existent leads to no data...
          getListener(listenerNameRef.current)
        } else if (isDocument) {
          addListener(
            listenerNameRef.current,
            (dbRef.current as DocumentReference).onSnapshot(
              (doc: DocumentSnapshot) => {
                if (doc.exists) {
                  setData({
                    ...doc.data({
                      serverTimestamps: 'estimate'
                    }),
                    id: doc.id
                  } as DataModel)
                }
                setExists(doc.exists)
                if (notifyOnNetworkStatusChange) setLoading(false)
              }
            )
          )
        } else {
          addListener(
            listenerNameRef.current,
            (dbRef.current as CollectionReference).onSnapshot(
              (querySnapshot: QuerySnapshot) => {
                const array: DataModel[] = []
                querySnapshot.forEach(doc => {
                  array.push({
                    ...doc.data({
                      serverTimestamps: 'estimate'
                    }),
                    id: doc.id
                  } as DataModel)
                })
                if (!querySnapshot.empty) {
                  setData(array)
                }
                setExists(!querySnapshot.empty)
                if (notifyOnNetworkStatusChange) setLoading(false)
              }
            )
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
}
