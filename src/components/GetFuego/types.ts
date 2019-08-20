import { UseQueryConfig, QueryDataHandler, QueryHookResponse } from '../../hooks/useFuego/types'
import { ReactElement } from 'react'

export interface GetFuegoProps extends UseQueryConfig, QueryDataHandler<{}> {
	children: (fuego: QueryHookResponse<{}>) => ReactElement
}
