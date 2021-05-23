import { FirebaseModule, firebase } from '../firebase-app';

export type OnDocumentChange<T> = (
  data: T,
  id: string,
  snapshot: firebase.firestore.DocumentSnapshot,
  changeType: firebase.firestore.DocumentChangeType
) => void;

export type OnCollectionOptions<T> = {
  removeAfterProcessed: boolean;
  onNewDoc?: OnDocumentChange<T>;
  onModifiedDoc?: OnDocumentChange<T>;
  onRemovedDoc?: OnDocumentChange<T>;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function onCollection<T>(
  firebase: FirebaseModule,
  collection: string,
  { onModifiedDoc, onNewDoc, onRemovedDoc, removeAfterProcessed: autoRemove }: OnCollectionOptions<T>
) {
  return firebase.app
    .firestore()
    .collection(collection)
    .onSnapshot((snap) => {
      snap.docChanges().forEach((change) => {
        const docId = change.doc.id;
        const data = change.doc.data();

        switch (change.type) {
          case 'added':
            onNewDoc?.(data as T, docId, change.doc, change.type);
            break;
          case 'modified':
            onModifiedDoc?.(data as T, docId, change.doc, change.type);
            break;
          case 'removed':
            onRemovedDoc?.(data as T, docId, change.doc, change.type);
            break;
        }

        if (change.type !== 'removed' && autoRemove) {
          firebase.app.firestore().doc(`${collection}/${docId}`).delete();
        }
      });
    });
}
