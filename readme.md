# fuego

🔥Firebase Firestore hooks & components to supercharge React and React Native.

# `useFuego`

## **Listen for live changes to a conversation**

```javascript
const Messages = () => {
  const { data, loading } = useFuego({
    path: 'chatrooms/room_1/messages',
    listen: true
  });

  if (loading) return <ActivityIndicator />;

  return data.map(message => <Message text={message.text} id={message.id} />);
};
```

## **Query a collection of users**

```javascript
const Users = () => {
  const { data, loading } = useFuego({ path: 'users' });

  if (loading) return <ActivityIndicator />;

  return data.map(user => <User name={user.name} id={user.id} />);
};
```

## **Query a more specific collection of users**

```javascript
const Users = () => {
  const { data, loading } = useFuego({
    path: 'users',
    limit: 10,
    where: ['name', '==', 'Fred Fuegington']
  });

  if (loading) return <ActivityIndicator />;

  return data.map(user => <User name={user.name} id={user.id} />);
};
```
