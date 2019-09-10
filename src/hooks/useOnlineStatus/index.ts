import { useEffect, useMemo, useCallback, useRef } from 'react'
import useFuegoContext from '../useFuegoContext'
import { OnlineStatus } from './types'
import useAppState from '../useAppState'

export default () => {
	const { auth, firebase } = useFuegoContext()
	let uid = ''

	const lastSentStatus = useRef<OnlineStatus['state']>()
	const ready = useRef(false)

	const databaseRef = useMemo(
		() => firebase.database().ref(`/status/${uid}`),
		[uid]
	)
	const status = useCallback((state: OnlineStatus['state']) => {
		return {
			state,
			lastChanged: firebase.database.ServerValue.TIMESTAMP
		}
	}, [])

	const onAppStateChange = useCallback((state: OnlineStatus['state']) => {
		if (ready.current && state !== lastSentStatus.current) {
			databaseRef.set(status(state))
		}
	}, [])

	useAppState(onAppStateChange)

	try {
		;({ uid } = auth().currentUser as firebase.User)
	} catch (e) {
		console.error('oh shoot, invalid auth in useOnlineStatus hook', e)
	}

	useEffect(() => {
		const infoRef = firebase.database().ref('.info/connected')

		infoRef.on('value', async snapshot => {
			if (!snapshot.val()) return

			try {
				await databaseRef.onDisconnect().set(status('inactive'))
				ready.current = true
				lastSentStatus.current = 'active'
				databaseRef.set(status(lastSentStatus.current))
			} catch (e) {
				console.error(
					`useOnlineStatus error within snapshot listener ${e}`
				)
			}
		})
		return () => {
			try {
				lastSentStatus.current = 'inactive'
				databaseRef.set(status(lastSentStatus.current))
				infoRef.off('value')
			} catch (e) {
				console.error('useOnlineStatus cleanup effect error', e)
			}
		}
	}, [uid])
}
