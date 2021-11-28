import { startFirebase } from './firebase-app';
import { FirebaseConfig } from './firebase-config';
import { FirebaseModule, FirebaseAppOptions } from './firebase-app';

export async function loadFirebase(
  config: FirebaseConfig,
  {
    emulator = {},
    name = 'default',
    use: { analytics = true, auth = true, firestore = true, functions = true, storage = true } = {},
  }: FirebaseAppOptions
): Promise<FirebaseModule> {
  return startFirebase(config, {
    name,
    emulator,
    use: {
      analytics,
      auth,
      firestore,
      storage,
      functions,
    },
  });
}
