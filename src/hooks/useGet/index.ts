import useQuery from '../useFuego'
import { FuegoQueryConfig } from '../../FuegoQuery/types'

export default (config: FuegoQueryConfig) => {
	const response = useQuery({
		...config,
		listen: false,
	})
	return response
}
