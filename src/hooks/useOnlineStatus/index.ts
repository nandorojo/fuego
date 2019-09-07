import { useEffect } from 'react'
import useFuegoContext from '../useFuegoContext'

export default () => {
	const { auth, firebase } = useFuegoContext()
	let uid = ''
	try {
		;({ uid } = auth().currentUser as firebase.User)
	} catch (e) {
		console.error('oh shoot, invalid auth in useOnlineStatus hook', e)
	}

	useEffect(() => {
		const databaseRef = firebase.database().ref(`/status/${uid}`)

		const offline = {
			state: 'offline',
			lastChanged: firebase.database.ServerValue.TIMESTAMP
		}
		const online = {
			state: 'online',
			lastChanged: firebase.database.ServerValue.TIMESTAMP
		}
		const infoRef = firebase.database().ref('.info/connected')

		infoRef.on('value', async snapshot => {
			if (!snapshot.val()) return

			try {
				await databaseRef.onDisconnect().set(offline)
				databaseRef.set(online)
			} catch (e) {
				console.error(
					`useOnlineStatus error within snapshot listener ${e}`
				)
			}
		})
		return () => {
			try {
				databaseRef.set(offline)
				infoRef.off('value')
			} catch (e) {
				console.error('useOnlineStatus cleanup effect error', e)
			}
		}
	}, [uid])
}
