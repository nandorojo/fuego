import {
	FuegoQueryConfig,
	OrderByArray,
	WhereItem,
	WhereType,
	WhereArray,
	OrderByType,
} from './types'
import { FirestoreDbType } from '../Fuego/types'
import { DocumentReference, CollectionReference, Query } from '@firebase/firestore-types'

export default class {
	private path: FuegoQueryConfig['path']
	private where: FuegoQueryConfig['where']
	private orderBy: FuegoQueryConfig['orderBy']
	private limit: FuegoQueryConfig['limit']
	private config: FuegoQueryConfig

	constructor(config: FuegoQueryConfig) {
		this.config = config
		const { path, where, orderBy, limit } = config
		this.path = path
		this.where = where
		this.orderBy = orderBy
		this.limit = limit
	}

	getRef(db: FirestoreDbType) {
		let ref: DocumentReference | CollectionReference | Query
		const { path, where, orderBy, limit } = this

		const isDocument = path.split('/').length % 2 === 0

		try {
			if (!path) throw new Error('empty path supplied to getRef')
		} catch (e) {
			// ref = null;
			console.error(e)
		}

		if (isDocument) {
			ref = db.doc(path)
		} else {
			ref = db.collection(path)
			if (where) {
				function multipleConditions(w: WhereType): w is WhereArray {
					return Array.isArray((w as WhereArray)[0])
				}
				if (multipleConditions(where)) {
					;(where as WhereArray).forEach((w: WhereItem) => {
						ref = (ref as CollectionReference).where(w[0], w[1], w[2])
					})
				} else if (typeof where[0] === 'string' && typeof where[1] === 'string') {
					ref = (ref as CollectionReference).where(where[0], where[1], where[2])
				}
			}
			if (orderBy) {
				if (typeof orderBy === 'string') {
					ref = ref && ref.orderBy(orderBy)
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
			if (limit) {
				ref = ref.limit(limit)
			}
		}
		return { ref, isDocument }
	}
	getQueryStringId() {
		const sorted = JSON.stringify(
			Object.keys(this.config)
				.sort()
				.map(configType => {
					return {
						[configType]: this.config[configType as keyof FuegoQueryConfig],
					}
				}),
		)
		return sorted
	}
}
