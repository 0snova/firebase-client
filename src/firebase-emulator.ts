import { connectAuthEmulator } from 'firebase/auth';
import { connectFirestoreEmulator, initializeFirestore } from 'firebase/firestore';
import { connectFunctionsEmulator } from 'firebase/functions';
import { connectStorageEmulator } from 'firebase/storage';

import { FirebaseModule } from './firebase-app';

export type FirebaseEmulatorOptions = {
  shouldUseEmulator?(): boolean;
  /* false - do not use Firehost Emulator even if shouldUseEmulator() is true */
  firestoreHost?: string | false;
  firestorePort?: number;
  /* false - do not use Authentication Emulator even if shouldUseEmulator() is true */
  authHost?: string | false;
  /* false - do not use Functions Emulator even if shouldUseEmulator() is true */
  functionsHost?: string | false;
  functionsPort?: number;

  storageHost?: string | false;
  storagePort?: number;
};

export const EMULATOR_FIRESTORE_HOST_DEFAULT = 'localhost';
export const EMULATOR_FIRESTORE_PORT_DEFAULT = 8080;

const EMULATOR_AUTHENTICATION_HOST_DEFAULT = 'http://localhost:9099';

const EMULATOR_FUNCTIONS_HOST_DEFAULT = 'localhost';
const EMULATOR_FUNCTIONS_PORT_DEFAULT = 5001;

const EMULATOR_STORAGE_HOST_DEFAULT = 'localhost';
const EMULATOR_STORAGE_PORT_DEFAULT = 9199;

export const shouldUseEmulatorWhenLocalhost = (): boolean => {
  /* TODO: Determine a more robust and common approach to detect if emulator is used  
    (maybe use environment variable)
  */

  /* TODO: add heuristics to detect if emulator is used when launched not in a browser */
  if (typeof window === 'undefined') {
    return false;
  }

  // use emulator if application is launched locally
  return window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
};

export const shouldNeverUseEmulator = () => false;

export function maybeUseEmulator(firebaseModule: FirebaseModule, options: FirebaseEmulatorOptions): void {
  const shouldUseEmulator = options.shouldUseEmulator ?? shouldNeverUseEmulator;

  if (shouldUseEmulator()) {
    console.log('Using Firebase Services Emulators.');

    if (options.authHost !== false) {
      const authHost = options.authHost ?? EMULATOR_AUTHENTICATION_HOST_DEFAULT;
      console.log(`Authentication Emulator ${authHost}`);
      connectAuthEmulator(firebaseModule.auth, authHost);
    }

    if (options.functionsHost !== false) {
      const functionsHost = options.functionsHost ?? EMULATOR_FUNCTIONS_HOST_DEFAULT;
      const functionsPort = options.functionsPort ?? EMULATOR_FUNCTIONS_PORT_DEFAULT;
      console.log(`Functions Emulator ${functionsHost}:${functionsPort}`);
      connectFunctionsEmulator(firebaseModule.functions, functionsHost, functionsPort);
    }

    if (options.storageHost !== false) {
      const storageHost = options.storageHost ?? EMULATOR_STORAGE_HOST_DEFAULT;
      const storagePort = options.storagePort ?? EMULATOR_STORAGE_PORT_DEFAULT;
      console.log(`Storage Emulator ${storageHost}:${storagePort}`);
      connectStorageEmulator(firebaseModule.storage, storageHost, storagePort);
    }
  }
}
