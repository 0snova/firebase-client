import { FirebaseConfig } from './firebase-config';
import { FirebaseApp, FirebaseAppOptions } from './firebase-app';

export async function loadFirebase(config: FirebaseConfig, options: FirebaseAppOptions): Promise<FirebaseApp> {
  const { startFirebase } = await import('./firebase-app');

  const modulesPromises: Promise<unknown>[] = [];

  if (options.use?.analytics) {
    modulesPromises.push(import('firebase/analytics'));
  }
  if (options.use?.firestore) {
    modulesPromises.push(import('firebase/firestore'));
  }
  if (options.use?.auth) {
    modulesPromises.push(import('firebase/auth'));
  }

  await Promise.all(modulesPromises);

  return startFirebase(config, options);
}
