import { useEffect } from 'react'
import { AppState, AppStateStatus } from 'react-native'

export default (callback: (state: AppStateStatus) => void) => {
	useEffect(() => {
		AppState.addEventListener('change', callback)

		return () => {
			AppState.removeEventListener('change', callback)
		}
	}, [])
}
