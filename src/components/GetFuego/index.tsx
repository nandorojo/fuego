import { FunctionComponent } from 'react'
import { GetFuegoProps } from './types'
import useFuego from '../../hooks/useFuego'

const GetFuego: FunctionComponent<GetFuegoProps> = ({
	handleData,
	handleLoading,
	handleError,
	children,
	...config
}) => {
	const fuego = useFuego(config, { handleData, handleError, handleLoading })

	return children(fuego)
}

export default GetFuego
