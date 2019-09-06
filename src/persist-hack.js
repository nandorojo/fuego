/*
  expo-firestore-persistence-hack
  
  A fragile weaving of various modules together to convince the Firestore
  web SDK to use persistence in an un-ejected Expo app.
  
  To use, first:
  
  ```
  $ expo install expo-sqlite
  $ yarn add indexeddbshim
  ```
  
  Then add the contents of this file to `expo-firestore-persistence-hack.js`
  in your project, and import it very early (likely in App.js).
  
  The bulk of the work is done by indexeddbshim, which provides an IndexedDB
  implementation on top of WebSQL. See the comments below above each hunk of
  code to understand how hacky this all is.
*/

import { SQLite } from 'expo-sqlite'

// Hack 1: The SQLite module from Expo is nominally
// WebSQL compatible. Let's just have the IndexedDB shim
// use it!
window.openDatabase = SQLite.openDatabase

// Hack 2: indexeddbshim will try to examine navigator.userAgent
// if navigator exists. In React Native, it does, but has no
// userAgent set. Set one here to avoid a crash.
navigator.userAgent = 'React-Native'

// Hack 3: Initialize indexeddbshim with origin checks disabled,
// cause they'll fail on our platform (and don't quite make sense.)
// (Do not change this to an import, cause that will get hoisted above
// our userAgent hack above.)
const setGlobalVars = require('indexeddbshim/dist/indexeddbshim-noninvasive')
setGlobalVars(window, { checkOrigin: false })

// Hack 4: Firestore persistence really wants to use localStorage
// to communicate between tabs. We don't really care about
// communicating between tabs - everything will be in the same
// process. However, Firestore needs something. So we'll give it
// a really weak, fake, in-memory localStorage. (Persisted storage
// will go through IndexedDB and into SQLite, on disk.)
window.__localStorageStore = {}
window.localStorage = {
  getItem: function(key) {
    return window.__localStorageStore[key]
  },
  setItem: function(key, value) {
    window.__localStorageStore[key] = value
  },
  removeItem: function(key) {
    delete window.__localStorageStore[key]
  },
  clear: function() {
    window.__localStorageStore = {}
  },
  key: function(i) {
    // Ever since ES6, the order of keys returned here is
    // stable 🤞
    Object.keys(window.__localStorageStore)[i]
  }
}

// You should now be able to initialize Firebase, and call
// firebase.firestore().enablePersistence()
//
// YMMV! YOLO!
