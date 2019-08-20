import React from 'react'
import { View, Text } from 'react-native'
import useFuego from './hooks/useFuego'

export default () => {
	const { data, loading } = useFuego({
		path: 'users',
		listen: true,
	})
	if (loading) return null

	const renderItem = ({ item: name }) => <Text>{name}</Text>

	return <FlatList data={data as object[]} renderItem={renderItem} />
}
