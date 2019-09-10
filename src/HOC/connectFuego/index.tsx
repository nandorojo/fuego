import React, { ComponentType } from 'react'
import { UseQueryConfig } from '../../hooks/useFuego/types'
import { HandleQueryConfig, DocumentModel } from '../../FuegoQuery/types'
import useFuego from '../../hooks/useFuego'
import useFuegoContext from '../../hooks/useFuegoContext'

function connectFuego<DataModel extends DocumentModel>(
    config: UseQueryConfig,
    handlers: HandleQueryConfig<DataModel>
) {
    return (WrappedComponent: ComponentType) => {
        return (props: any) => {
            const context = useFuegoContext()
            const { data, loading, error } = useFuego<DataModel>(
                config,
                handlers
            )

            return (
                <WrappedComponent
                    {...props}
                    {...{ data, loading, error, ...context }}
                />
            )
        }
    }
}

export default connectFuego
