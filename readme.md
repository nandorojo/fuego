# fuego

🔥Firebase Firestore hooks & components to supercharge React and React Native.

# Table of Contents

- `useFuego`
- `connectFuego`
- `GetFuego`

# `useFuego`

React hook that turns any firestore query into a responsive react / react native component.

## `useFuego` usecases

### **Listen for live changes to a conversation**

Fuego automatically handles removing the listeners when a component unmounts.

```javascript
const Chat = ({ roomId }) => {
  const { data, loading } = useFuego({
    path: `chatrooms/${roomId}/messages`,
    // listen to updates
    listen: true
  });

  if (loading) return <ActivityIndicator />;

  return data.map(message => <Message text={message.text} id={message.id} />);
};
```

### **Query a collection of users**

```javascript
const Users = () => {
  const { data, loading } = useFuego({ path: 'users' });

  if (loading) return <ActivityIndicator />;

  return data.map(user => <User name={user.name} id={user.id} />);
};
```

### **Query a more specific collection of users**

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
