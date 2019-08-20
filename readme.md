# fuego

🔥Firebase Firestore hooks & components to supercharge React and React Native.

```
npm i --save @nandorojo/fuego
```

_Requires react 16.8.3 or higher to support hooks._

## Setup

Wrap your `App.js` component with the `FuegoProvider`;

```javascript
import { FuegoProvider } from '@nandorojo/fuego';

export default () => {
  <FuegoProvider>
    <App />
  </FuegoProvider>;
};
```

## `useFuego`

See [`useFuego` docs]() for custom options.

React hook that turns any firestore query into a stateful component.

### Query users

Don't worry about parsing through firestore's `querySnapshot`. Fuego handles that for you.

```javascript
const Users = () => {
  const { data, loading } = useFuego({ path: 'users' });

  if (loading) return <Loading />;

  return data.map(user => <User name={user.name} id={user.id} />);
};
```

### Real-time chat in ten lines of code

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

### Query popular memes

```javascript
const Users = () => {
  const { data, loading } = useFuego({
    path: 'memes',
    limit: 20,
    where: ['popularity', '>=', '90'],
    orderBy: 'popularity'
  });

  if (loading) return <Loading />;

  return data.map(user => <User name={user.name} id={user.id} />);
};
```
