import useQuery from '../useFuego'

export default () => {
	const { data } = useQuery({
		path: 'hi/there',
	})
}
