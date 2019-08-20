import React, { FunctionComponent, useRef } from 'react';
import FuegoContext from '../FuegoContext';
import { FuegoContextProps } from '../FuegoContext/types';
import { FuegoProviderProps, FuegoProviderListeners, ListenerType } from './types';

const FuegoProvider: FunctionComponent<FuegoProviderProps> = ({ fuego, children }) => {
	const listeners = useRef<FuegoProviderListeners>({});

	const addListener = (name: string, listener: () => void) => {
		listeners.current[name] = listener;
		return listeners.current[name];
	};

	const removeListener = (name: string) => {
		function listenerExists(listener: ListenerType): listener is () => void {
			return !!listener && !!(listener as () => void) && typeof listener === 'function';
		}
		if (listenerExists(listeners.current[name])) {
			(listeners.current[name] as () => void)();
			listeners.current[name] = null;
		}
	};

	const doesListenerExist = (name: string) => {
		return !!listeners.current[name];
	};

	const getListener = (name: string) => {
		if (doesListenerExist(name)) return listeners.current[name];
		return null;
	};

	const value: FuegoContextProps = {
		db: fuego.db,
		auth: fuego.auth,
		addListener,
		removeListener,
		doesListenerExist,
		getListener,
	};
	return <FuegoContext.Provider {...{ value }}>{children}</FuegoContext.Provider>;
};

export default FuegoProvider;
