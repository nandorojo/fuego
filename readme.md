# fuego

🔥 Firebase Firestore hooks & components for React and React Native.

⚡️ Provides out-of-the-box optimization to prevent memory leaks from multiple listeners/subscriptions.

## Install

```
npm i --save @nandorojo/fuego firebase
```

_Requires react 16.8.3 or higher to support hooks._

## `useFuego`

React hook that turns any firestore query into a stateful component.

See [`useFuego` docs]() for custom options.

### Query users

Don't worry about parsing through firestore's `querySnapshot`. Fuego handles that for you.

```javascript
import { useFuego } from '@nandorojo/fuego'

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

### Easily write data to your backend

```javascript
// NOTE this is using useFuegoContext, not useFuego
import { useFuegoContext } from '@nandorojo/fuego'

const ChatRoom = (props) => {
  // access the firestore db object
  const { db } = useFuegoContext()
  
  const sendMessage = (text) => {
   // write to the firestore db
  	db.collection(`channels/${props.id}/messages`).add({ text })
  }

 // return your render code here...
}
```


## Setup

1. Wrap your `App.js` component with the `<FuegoProvider />` component. Pass a `Fuego` instance as a prop.
2. Place the `<FuegoGate />` component directly within the provider component to make sure your app has up-to-date auth.

_See [firebase's website](https://firebase.google.com/docs/web/setup#config-object) for steps on getting your `firebaseConfig`._

** Example**

```javascript
import React from 'react'
import { FuegoProvider, Fuego, FuegoGate } from '@nandorojo/fuego'
import YourAppHere from './path/to/app'

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
      <FuegoGate signInAnonymously displayName="AnonymousTestName">
        <YourAppHere />
      <FuegoGate>
    </FuegoProvider>
  )
}
```

# Docs

# `useFuego`

React hook to query Firestore. Allows both for one-time `get` requests or `snapshot` listeners.

## Arguments

`useFuego` takes 2 arguments: `query` and `options`.

``` javascript
const { data, loading } = useFuego(query, options)
```

```javascript
data
loading
error
db
ref
unsubscribe
```

## Returns

# `<FuegoGate />`

Component that lets your app always be properly authenticated with firebase. Its children won't render until the app has successfully authenticated.

**Important:** This component must be wrapped within the `FuegoProvider` to work. It's highly recommended you make it the direct child (as seen in the example above), though it isn't techincally necessary.

## FuegoGate props

| Prop | Type | Description | example |
|---------------------|--------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|---------|
| `signInAnonymously` | `boolean` | (Optional) If true, users will automtically be signed in anonymously, _unless_ the `AuthComponent` prop is specified. This is useful for testing with anonymous users. |  |
| `beforeAuthUpdate` | `(user: firebase.User or null) => void` | (Optional) Callback function that will be called when the auth updates, right before the component updates. It takes one argument: a user if it exists, and null otherwise. This is useful if you want to store the user in redux or some other state manager. |  |
| `displayName` | `string` | (Optional) A display name given to the user *if* the `signInAnonymously` prop is set to `true`. |  |
| `photoURL` | `string` | (Optional) A photo url given to the user *if* the `signInAnonymously` prop is set to `true`. |  |
| `LoadingComponent` | `ReactNode | null` | (Optional) A react component that renders while the auth is initially loading. Defaults to a screen with a loading indicator; you can also set it to null to disable it. |  |
| `AuthComponent` | `ReactNode` | (Required if you don't set `signInAnonymously` to `true`. A react component to render when loading has completed and the user is not currently signed in. This is where you insert your own auth flow component. It receives this firebase instance's `auth` as a prop, so you can use `this.props.auth().signInWithToken` in the component or other firebase `auth` methods using that prop. Overrides signInAnonymously if prop is set. |  |


```javascript
// ...following the <FuegoProvider /> example

export default () => {
  return (
    <FuegoProvider fuego={fuego}>
      <FuegoGate> // <-- this part is added
        <App />
      </FuegoGate>
    </FuegoProvider>
  )
}
```
