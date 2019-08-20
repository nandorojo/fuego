import { FirestoreDbType } from '../Fuego/types';
import firebase from 'firebase';

export interface FuegoContextProps {
	db: FirestoreDbType;
	auth: firebase.auth.Auth;
	addListener: (name: string, listener: () => void) => void;
	removeListener: (name: string) => void;
	doesListenerExist: (name: string) => boolean;
	getListener: (name: string) => (() => void) | null;
}
