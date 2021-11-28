import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAnalytics, Analytics } from 'firebase/analytics';
import { getFirestore, Firestore, connectFirestoreEmulator, initializeFirestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { getFunctions, Functions } from 'firebase/functions';

import { FirebaseConfig } from './firebase-config';
import {
  EMULATOR_FIRESTORE_HOST_DEFAULT,
  EMULATOR_FIRESTORE_PORT_DEFAULT,
  FirebaseEmulatorOptions,
  maybeUseEmulator,
  shouldNeverUseEmulator,
} from './firebase-emulator';

export * from 'firebase/app';

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
export type FirebaseModule = {
  app: FirebaseApp;
  firestore: Firestore;
  auth: Auth;
  storage: FirebaseStorage;
  functions: Functions;
  analytics: Analytics;
};

export function startFirebase(
  config: FirebaseConfig,
  { name, emulator }: FirebaseAppOptionsWithDefaultValues
): FirebaseModule {
  // Check if app with provided name already exists. It is usefull for development environments with HMR
  // to avoid Firebase errors about already initialized app.
  const apps = getApps();
  const isAppInitialized = apps.length ? apps.find((app) => app.name === name) : undefined;

  // Get already initialized app or create a new one.
  const app = isAppInitialized ? getApp(name) : initializeApp(config, name);

  const shouldUseEmulator = emulator.shouldUseEmulator ?? shouldNeverUseEmulator;

  function initFirestore() {
    const firestoreHost = (emulator.firestoreHost as string | undefined) ?? EMULATOR_FIRESTORE_HOST_DEFAULT;
    const firestorePort = emulator.firestorePort ?? EMULATOR_FIRESTORE_PORT_DEFAULT;
    console.log(`Firestore Emulator ${firestoreHost}:${firestorePort}`);

    const firestore = initializeFirestore(app, {
      host: firestoreHost,
      ssl: false,
    });

    connectFirestoreEmulator(firestore, firestoreHost, firestorePort);

    return firestore;
  }

  const firebaseModule = {
    app,
    analytics: getAnalytics(app),
    firestore:
      !isAppInitialized && shouldUseEmulator() && emulator.firestoreHost !== false
        ? initFirestore()
        : getFirestore(app),
    functions: getFunctions(app),
    auth: getAuth(app),
    storage: getStorage(app),
  };

  // Initialize required modules only if app is initialized for the first time.
  if (!isAppInitialized) {
    maybeUseEmulator(firebaseModule, emulator);
  }

  return firebaseModule;
}
