import React from 'react'
import { View, Text, FlatList } from 'react-native'
import useFuego from './hooks/useFuego'
import {
    CollectionModel,
    FirestoreDataModel,
    DocumentModel
} from './FuegoQuery/types'

interface Model extends DocumentModel {
    text: 'hi'
}

export default () => {
    const { data, loading } = useFuego<Model>({
        path: 'users',
        listen: true
    })
    if (loading) return null

    const renderItem = ({ item: name }) => <Text>{name}</Text>

    return <FlatList data={data as CollectionModel} renderItem={renderItem} />
}
