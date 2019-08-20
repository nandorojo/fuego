# fuego

🔥Firebase Firestore hooks & components to supercharge React and React Native.

```
npm i --save @nandorojo/fuego
```

# Table of Contents

- `useFuego`
- `connectFuego`
- `GetFuego`

# `useFuego`

React hook that turns any firestore query into a stateful component.

## `useFuego` usecases

### **Build real-time chat in ten lines of code**

Fuego automatically handles removing the listeners when a component unmounts.

```javascript
const Chat = ({ roomId }) => {
  const { data, loading } = useFuego({
    path: `chatrooms/${roomId}/messages`,
    // subscribe to live to updates
    listen: true
  });

  if (loading) return <Loading />;

  return data.map(message => <Message text={message.text} id={message.id} />);
};
```

### **Query users instantly**

Don't worry about parsing through firestore's `querySnapshot`. fuego handles that for you.

```javascript
const Users = () => {
  const { data, loading } = useFuego({ path: 'users' });

  if (loading) return <Loading />;

  return data.map(user => <User name={user.name} id={user.id} />);
};
```

### **Perform complex query of **

```javascript
const Users = () => {
  const { data, loading } = useFuego({
    path: 'users',
    limit: 10,
    where: ['name', '==', 'Fred Fuegington']
  });

  if (loading) return <Loading />;

  return data.map(user => <User name={user.name} id={user.id} />);
};
```
