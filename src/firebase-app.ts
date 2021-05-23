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
    functions?: boolean;
    storage?: boolean;
  };
  emulator?: FirebaseEmulatorOptions;
}

export type FirebaseAppOptionsWithDefaultValues = Required<FirebaseAppOptions>;

export type Firebase = typeof firebase;
export type FirebaseModule = { app: firebase.app.App; firebase: Firebase };

export function startFirebase(
  config: FirebaseConfig,
  { name, use: { analytics }, emulator }: FirebaseAppOptionsWithDefaultValues
): FirebaseModule {
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

  return { app, firebase };
}
