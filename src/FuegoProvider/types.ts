import Fuego from '../Fuego'

export interface FuegoProviderProps {
	fuego: Fuego
}

export type ListenerType = (() => void) | null

export type FuegoProviderListeners = { [key in string]: ListenerType }
