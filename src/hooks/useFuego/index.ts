import useFuegoContext from '../useFuegoContext'
import { UseQueryConfig, QueryDataModel, QueryHookResponse, QueryDataHandler } from './types'
import { useEffect, useState } from 'react'
import FuegoQuery from '../../FuegoQuery'
import { DocumentReference, CollectionReference } from '@firebase/firestore-types'

function useFuego<DataModel>(
	{ path, where, orderBy, limit, listen = false }: UseQueryConfig,
	{ handleData, handleLoading, handleError }: QueryDataHandler<DataModel> = {},
): QueryHookResponse<DataModel> {
	const { db, addListener, removeListener, doesListenerExist, getListener } = useFuegoContext()
	const [data, setDataState] = useState<DataModel | QueryDataModel>(null)
	const [loading, setLoadingState] = useState(true)
	const [error, setErrorState] = useState<QueryHookResponse<DataModel>['error']>(null)

	const [setData, setLoading, setError] = [
		handleData || setDataState,
		handleLoading || setLoadingState,
		handleError || setErrorState,
	]

	useEffect(() => {
		const query = new FuegoQuery({ path, where, orderBy, limit })
		const listenerName = query.getQueryStringId()

		const init = async () => {
			try {
				if (!path) throw new Error('empty path supplied')
				const { ref, isDocument } = query.getRef(db)

				if (!listen) {
					if (isDocument) {
						const doc = await (ref as DocumentReference).get()
						setData({
							...doc.data(),
							id: doc.id,
						})
					} else {
						const response = await (ref as CollectionReference).get()
						const r: object[] = []
						response.forEach(doc => r.push({ ...doc.data(), id: doc.id }))
						setData(r)
					}
					setLoading(false)
				} else {
					const listenerExists = doesListenerExist(listenerName)
					if (listenerExists) {
						getListener(listenerName)
					} else if (isDocument) {
						addListener(
							listenerName,
							(ref as DocumentReference).onSnapshot((doc: any) => {
								setData({ ...doc.data(), id: doc.id })
								setLoading(false)
							}),
						)
					} else {
						addListener(
							listenerName,
							(ref as CollectionReference).onSnapshot(querySnapshot => {
								const array: object[] = []
								querySnapshot.forEach(doc => {
									array.push({
										...doc.data(),
										id: doc.id,
									})
								})
								setData(array as object[])
								setLoading(false)
							}),
						)
					}
				}
			} catch (e) {
				setError(e)
				console.error('useQuery failed:', e)
			}
		}
		init()
		return () => {
			// function listenerIsFunction(l: typeof listener): l is () => void {
			// 	return l && typeof (l as () => void) === 'function';
			// }
			// if (listenerIsFunction(listener)) (listener as () => void)();
			removeListener(listenerName)
		}
	}, [path, listen, where, orderBy])

	return { data, loading, error, db }
}

export default useFuego
