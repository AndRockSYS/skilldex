import { onValueWritten } from 'firebase-functions/database';
import admin from 'firebase-admin';

admin.initializeApp();

export const queueManager = onValueWritten(
    {
        ref: '/queue/{gameId}',
        region: 'europe-west1',
        timeoutSeconds: 125,
    },
    async (event) => {
        try {
            const gameId = Number(event.params.gameId);
            const queueData = event.data.after.val();

            if (!queueData || isNaN(gameId)) {
                console.log('No queue data or invalid gameId. Exiting.');
                return null;
            }

            const timeoutMs = 2 * 60 * 1000;
            const timestamp = Number(queueData.timestamp);

            const timeoutTime = timestamp + timeoutMs;
            const now = Date.now();
            const delayMs = timeoutTime - now;

            await new Promise((resolve) => setTimeout(resolve, delayMs));

            const queueSnapshot = await admin.database().ref(`/queue/${gameId}`).once('value');
            if (!queueSnapshot.exists()) {
                console.log(`Queue for gameId ${gameId} no longer exists. Exiting.`);
                return null;
            }

            const db = admin.firestore();
            const lobbySnapshot = await db.collection('games').where('id', '==', gameId).get();

            if (lobbySnapshot.empty) {
                console.log(`No game lobby found with gameId ${gameId}. Exiting.`);
                return null;
            }

            const gameData = lobbySnapshot.docs[0].data();

            if (!gameData.opponent) await admin.database().ref(`/queue/${gameId}`).remove();

            return null;
        } catch (error) {
            console.error('Error in queueManager function:', error);
            return null;
        }
    }
);
