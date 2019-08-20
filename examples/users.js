import useFuego from '../src/hooks/useFuego/index';
import { ActivityIndicator } from 'react-native';
const User = ({ id, name }) => <View />;

const Users = () => {
  const { data, loading } = useFuego({
    path: 'users',
    limit: 10,
    where: ['name', '==', 'Fred Fuegington']
  });

  if (loading) return <ActivityIndicator />;

  return data.map(user => <User name={user.name} id={user.id} />);
};

export default Users;
