import React from 'react'
import { db } from '../firebase.config';

export default function ClearChat() {

    async function clearChat(db, collectionPath, batchSize) {
        const collectionRef = collectionPath(collectionPath)
        const query = collectionRef.orderBy('__name__').limit(batchSize);

        return new Promise((resolve, reject) => {
            deleteQueryBatch(db, query, resolve).catch(reject);
        });
    }

    async function deleteQueryBatch(db, query, resolve) {
        const snapshot = await query.get();

        const batchSize = snapshot.size;
        if (batchSize === 0) {
            // When there are no documents left, we are done
            resolve();
            return;
        }

        // Delete documents in a batch
        const batch = db.batch();
        snapshot.docs.forEach((doc) => {
            batch.delete(doc.ref);
        });
        await batch.commit();

        // Recurse on the next process tick, to avoid
        // exploding the stack.
        process.nextTick(() => {
            deleteQueryBatch(db, query, resolve);
        });
    }

    return (
        <div className='' onClick={() => clearChat(db, 'messages', 100)} >Clear Chat</div>
    )
}
