# fuego

🔥Firebase Firestore hooks & components to supercharge React and React Native.

```
npm i --save @nandorojo/fuego
```

_Requires react 16.8.3 or higher._

# `useFuego`

React hook that turns any firestore query into a stateful component.

## Example usecases

### **Query users instantly**

Don't worry about parsing through firestore's `querySnapshot`. Fuego handles that for you.

```javascript
const Users = () => {
  const { data, loading } = useFuego({ path: 'users' });

  if (loading) return <Loading />;

  return data.map(user => <User name={user.name} id={user.id} />);
};
```

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
