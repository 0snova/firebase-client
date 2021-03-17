# @osnova/firebase-client

It is never (or almost never) a good idea to load Firebase Web SDK synchronously in the browser because of it's enormous size. This package is a thin wrapper over Firebase that allows to load lazily only necessary modules and handles some edge cases.

## Features

- Lazy loading of only necessary modules.
- Support for [Emulator Suite](https://firebase.google.com/docs/emulator-suite).
- Use multiple Firebase applications per page.
- Does not break on HMR.

## Install

```sh
# npm
npm install @osnova/firebase-client firebase --save
# yarn
yarn add @osnova/firebase-client firebase
```

## Usage

Default export is the function that lazily loads and initializes Firebase:

```typescript
import startFirebase from '@osnova/firebase-client';

/* Firebase SDK config. Can be retrieved from Firebase Console. 
     https://firebase.google.com/docs/web/setup#register-app */
const config = {
  apiKey: 'apiKey',
  authDomain: 'project.firebaseapp.com',
  databaseURL: 'https://project.firebaseio.com',
  projectId: 'project',
  storageBucket: 'project.appspot.com',
  messagingSenderId: 'messagingSenderId',
  appId: 'appId',
  measurementId: 'measurementId',
};

startFirebase(config, {
  name: `my-firebase-app`,
  use: {
    // specify which modules will be used
    analytics: true,
    auth: true,
    firestore: true,
  },
}).then((app) => {
  // firebase is available and ready to use.
});
```

### Usage with Emulator Suite

By default `@osnova/firebase-client` will not use to any emulators.

This behaviour can be modified with `emulator` option:

```typescript
import startFirebase, { shouldUseEmulatorWhenLocalhost } from '@osnova/firebase-client';

startFirebase(config, {
  /* ...rest config */
  emulator: {
    shouldUseEmulator: shouldUseEmulatorWhenLocalhost, // default value is `() => false`
    firestoreHost: `localhost:8080`, // this is a default value
    authHost: `http://localhost:9099`, // this is a default value
  },
}).then((app) => {
  // firebase is available and ready to use.
});
```

`shouldUseEmulatorWhenLocalhost` is a built-in function that detects if application is running on `localhost`.
You can provide your own function:

```typescript
function shouldUseEmulatorIfEnv() {
  return !!process.env.FIREBASE_EMULATOR;
}
```

Emulators will be used If `options.emulator.shouldUseEmulator` return `true`.

`options.emulator.firestoreHost` and `options.emualator.authHost` can accept `false` value, which means that corresponding emulator will not be used even if `shouldUseEmulator` returned `true`.
