import { FirebaseApp } from './firebase-app';

export type FirebaseEmulatorOptions = {
  shouldUseEmulator?(): boolean;
  /* false - do not use Firehost Emulator even if shouldUseEmulator() is true */
  firestoreHost?: string | false;
  /* false - do not use Authentication Emulator even if shouldUseEmulator() is true */
  authHost?: string | false;
};

const EMULATOR_FIRESTORE_HOST_DEFAULT = 'localhost:8080';
const EMULATOR_AUTHENTICATION_HOST_DEFAULT = 'http://localhost:9099';

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

const shouldNeverUseEmulator = () => false;

export function maybeUseEmulator(firebase: FirebaseApp, options: FirebaseEmulatorOptions): void {
  const shouldUseEmulator = options.shouldUseEmulator ?? shouldNeverUseEmulator;

  if (shouldUseEmulator()) {
    console.log('Using Firebase Services Emulators.');

    if (options.firestoreHost !== false) {
      const firestoreHost = options.firestoreHost ?? EMULATOR_FIRESTORE_HOST_DEFAULT;
      console.log(`Firestore Emulator ${firestoreHost}`);
      firebase.firestore().settings({
        host: firestoreHost,
        ssl: false,
      });
    }

    if (options.authHost !== false) {
      const authHost = options.authHost ?? EMULATOR_AUTHENTICATION_HOST_DEFAULT;
      console.log(`Authentication Emulator ${authHost}`);
      firebase.auth().useEmulator(authHost);
    }
  }
}
