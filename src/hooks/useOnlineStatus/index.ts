import { useEffect, useState, useMemo, useRef } from 'react'
import useFuegoContext from '../useFuegoContext'
import useFuego from '../../../lib/typescript/hooks/useFuego/index.d'

export default () => {
	const { auth, firebase } = useFuegoContext()

	useEffect(() => {
		const { uid } = auth().currentUser
		const databaseRef = firebase.database().ref(`/status/${uid}`)
		const offline = {
			state: 'offline',
			lastChanged: firebase.database.ServerValue.TIMESTAMP
		}
		const online = {
			state: 'online',
			lastChanged: firebase.database.ServerValue.TIMESTAMP
		}
		firebase
			.database()
			.ref('.info/connected')
			.on('value', async snapshot => {
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
	}, [])
}
