import useFuego from '../../hooks/useFuego'
import { DocumentModel } from '../../FuegoQuery/types'
import { ReactElement } from 'react'
import { GetFuegoProps } from './types'

function GetFuego<Data extends DocumentModel>(
    props: GetFuegoProps<Data>
): ReactElement<GetFuegoProps<Data>> {
    const { handleData, handleLoading, handleError, ...config } = props
    const fuego = useFuego<Data>(config, {
        handleData,
        handleError,
        handleLoading
    })

    return props.children(fuego)
}

export default GetFuego
