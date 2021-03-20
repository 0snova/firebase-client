import { loadFirebase } from './entry';

export type { FirebaseConfig } from './firebase-config';
export type { FirebaseAppOptions, FirebaseApp, firebase } from './firebase-app';
export type { FirebaseEmulatorOptions } from './firebase-emulator';
export { shouldUseEmulatorWhenLocalhost } from './firebase-emulator';

export type { OnCollectionOptions, OnDocumentChange } from './operators/on-collection';
export { onCollection } from './operators/on-collection';

export default loadFirebase;
