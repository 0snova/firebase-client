import { FirebaseConfig } from './firebase-config';
import { FirebaseApp, FirebaseAppOptions } from './firebase-app';

export async function loadFirebase(
  config: FirebaseConfig,
  { emulator = {}, name = 'default', use: { analytics = true, auth = true, firestore = true } = {} }: FirebaseAppOptions
): Promise<FirebaseApp> {
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

  await Promise.all(modulesPromises);

  return startFirebase(config, {
    name,
    emulator,
    use: {
      analytics,
      auth,
      firestore,
    },
  });
}
