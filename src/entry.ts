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
  const { startFirebase } = await import('./firebase-app');

  const modulesPromises: Promise<unknown>[] = [];

  if (analytics) {
    modulesPromises.push(import('firebase/analytics'));
  }
  if (firestore) {
    modulesPromises.push(import('firebase/firestore'));
  }
  if (auth) {
    modulesPromises.push(import('firebase/auth'));
  }
  if (functions) {
    modulesPromises.push(import('firebase/functions'));
  }
  if (storage) {
    modulesPromises.push(import('firebase/storage'));
  }

  await Promise.all(modulesPromises);

  return startFirebase(config, {
    name,
    emulator,
    use: {
      analytics,
      auth,
      firestore,
      storage,
    },
  });
}
