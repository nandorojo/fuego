# fuego

🔥 Firebase Firestore hooks & components for React and React Native.

```
npm i --save @nandorojo/fuego
```

_Requires react 16.8.3 or higher to support hooks._

## `useFuego`

React hook that turns any firestore query into a stateful component.

See [`useFuego` docs]() for custom options.

### Query users

Don't worry about parsing through firestore's `querySnapshot`. Fuego handles that for you.

```javascript
const Users = () => {
  const { data, loading } = useFuego({ path: 'users' })

  if (loading) return <Loading />

  return data.map(user => <User name={user.name} id={user.id} />)
}
```

### Real-time chat in ten lines of code

Fuego automatically handles removing the listeners when a component unmounts.

```javascript
const Chat = ({ roomId }) => {
  const { data, loading } = useFuego({
    path: `chatrooms/${roomId}/messages`,
    // subscribe to live to updates
    listen: true
  })

  if (loading) return <Loading />

  return data.map(message => <Message text={message.text} id={message.id} />)
}
```

### Query popular memes

```javascript
const Memes = () => {
  const { data, loading } = useFuego({
    path: 'memes',
    limit: 20,
    where: ['popularity', '>=', '90'],
    orderBy: 'popularity'
  })

  if (loading) return <Loading />

  return data.map(user => <Meme url={meme.url} id={meme.id} />)
}
```

## Setup

Wrap your `App.js` component with the `FuegoProvider` component. Pass a `Fuego` instance as a prop.

_See [firebase's website](https://firebase.google.com/docs/web/setup#config-object) for steps on getting your `firebaseConfig`._

```javascript
// ...other imports
import { FuegoProvider, Fuego } from '@nandorojo/fuego'

// replace with your custom firebaseConfig
const firebaseConfig = {
  apiKey: 'api-key',
  authDomain: 'project-id.firebaseapp.com',
  databaseURL: 'https://project-id.firebaseio.com',
  projectId: 'project-id',
  storageBucket: 'project-id.appspot.com',
  messagingSenderId: 'sender-id',
  appID: 'app-id'
}

const fuego = new Fuego(firebaseConfig)

export default () => {
  return (
    <FuegoProvider fuego={fuego}>
      <App />
    </FuegoProvider>
  )
}
```
