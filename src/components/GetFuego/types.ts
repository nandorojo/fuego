import {
    UseQueryConfig,
    QueryDataHandler,
    QueryHookResponse
} from '../../hooks/useFuego/types'
import { ReactElement } from 'react'
import { DocumentModel } from '../../FuegoQuery/types'

export interface GetFuegoProps<DataModel extends DocumentModel>
    extends UseQueryConfig,
        QueryDataHandler<DataModel> {
    children: (fuego: QueryHookResponse<{}>) => ReactElement
}
