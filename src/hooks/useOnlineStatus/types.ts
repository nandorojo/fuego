import firebase from 'firebase'
import { AppStateStatus } from 'react-native'

export interface OnlineStatus {
	state: AppStateStatus
	lastChanged: typeof firebase.database.ServerValue.TIMESTAMP
}
