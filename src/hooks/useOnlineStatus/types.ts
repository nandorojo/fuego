import firebase from 'firebase'

export interface OnlineStatus {
	state: 'active' | 'background' | 'inactive'
	lastChanged: typeof firebase.database.ServerValue.TIMESTAMP
}
