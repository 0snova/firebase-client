import firebase from 'firebase/app';
import { FirebaseConfig } from './firebase-config';
import { FirebaseEmulatorOptions, maybeUseEmulator } from './firebase-emulator';

export type { firebase };

export interface FirebaseAppOptions {
  name?: string;
  use?: {
    analytics?: boolean;
    firestore?: boolean;
    auth?: boolean;
  };
  emulator?: FirebaseEmulatorOptions;
}

export type FirebaseApp = firebase.app.App;
export type Firebase = typeof firebase;

export function startFirebase(
  config: FirebaseConfig,
  { name = 'default', use: { analytics = true } = {}, emulator = {} }: FirebaseAppOptions = {}
): FirebaseApp {
  // Check if app with provided name already exists. It is usefull for development environments with HMR
  // to avoid Firebase errors about already initialized app.
  const isAppInitialized = firebase.apps.length ? firebase.apps.find((app) => app.name === name) : undefined;

  // Get already initialized app or create a new one.
  const app = isAppInitialized ? firebase.app(name) : firebase.initializeApp(config, name);

  // Initialize required modules only if app is initialized for the first time.
  if (!isAppInitialized) {
    if (analytics) {
      firebase.analytics();
    }

    maybeUseEmulator(app, emulator);
  }

  return app;
}