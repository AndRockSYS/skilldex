import { onValueWritten } from 'firebase-functions/database';
import admin from 'firebase-admin';

const firebaseAdmin = {
    type: 'service_account',
    project_id: 'skilldex-d571f',
    private_key_id: '9b7d3d0f5fc472bfa6aaaa8d727efdf124845c8d',
    private_key:
        '-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQDiZChFGbLd/GhX\nQ6if57AgYKlnZS5JRxaGO9eA8GIvlzZ9d5OJ7RzcQCWzH6chkgkFDpo6uuKsDWKq\nZ+FC1zwu23ArkIg0zS5FsFsbmmba6pFcgJCf2IcWDcIqGB+j6s0GD2O2W9Cqq/kX\nKrne0+8CD4OWkeDpj7bztYc0T73TylDzFybEi3DfA+44OGuwL/bAdgSMdh8y9vie\nJBo+LGyZY/nuc8PJbKQjPTJ429UjzsynbqMUay2upaCGrypfjwuJfcIctBI2N3Fa\nS1O74AkZqShUGpLiR7FuUy1B+dEToJa/CkKQUfWcPjn4+wc8ZAM2wd3FzSCjTbHG\nlX6ocgM1AgMBAAECggEAKqOxn/4snbnWDyWLo354Qkjibzpz4tJUUDkCKGNeIteI\nqE32yGIT7vnX/+pEyMJgF4c+DjS3z67/t9ez6ipux+aFtHbW6JcCkZabOlI08COA\n+FqwoqKeIs25lcMQZoepUOxiG+0kGpkkY7Qk6O6i1BEG+DuGkIcEbtdwXS5tsu9L\n6K4fftCzckmMy7p4b6FQdrhlV15q3DQOvay2pmVGpIoc9w2iW5Ji48Bru+D2OZZe\nvzHEv8qxGX38fZLA971QT14s8GSJ31HsB8LyRUhSSWEy0EMpTpa8plmkA9rypKCs\nYX/FXQVFw9HdDVmeB6Ed2d/pXHUe2aNQQKgimMHTcQKBgQD0Z15l23hADXn8Urgj\nXWD8RMSnvVfVr51/z4SZF2mLrNQt0g0hKWiHr45C2BYceDfYPUaIr5svrXnBgxJf\nsckm9+SiuVm9OJC0HKmhDid8tIRfZBWFANeOJjVsOQZG40Dgymze3jRHDgSS2yF2\nVZ32QEZjrvxHAE9LFG5ShhiF+QKBgQDtIgAoFMecJYDhRJOZHNwFkVu6KcQYk0ol\nfbf1z0sTPgg7gA2MxYTH4hBRxbH8RSo1s6heYzTUp//aARZogfxaqr7KMtKQjt1E\nUyD3Wm2ykphPqckQNWl5tmIKy6/oZbWv1XCgL/N12fa6g52peQwkBoeFkjzoYznt\nHuINXn8GHQKBgQDqlLinPTK7D/RQujihQQRQvdSfR34hzLB4N38GzdDxTk5NOHp/\npNX+vgLmp675Xm4DcDTeBucFqRTfJuYg0WzHqVFa2lqG4t8I8SXjPsmpyT3wrQh2\no2tBtey61jTvHzprR/+dHlvBA3RiXE9O3DiEXgbxsMfVgjeZUZ/eN3UcSQKBgFXE\nrnnQykHX7r2LqDcBETOSV7MF2D9rRq44wojN6UGUdjXPIxd/eX8ybOSmtLGh8ppp\n2MQK7djcytV2/zvdiADjMQ7BQxe2FKHZz1qoAnVMQHrP1kFekD/Nj7iH46AS6Zwn\nfwzxSwWdSHg9kpDxj0qYcfwF4LHM8e6p9OkQ/LChAoGBANGcWLUYapWx54UJPhVI\nWCizMGulR+whIdAEBa+yzgctFqQTXN7G3JpnUDfUZ062ZasHvBC88TH4hBm0/8fl\noer9ubBfbcohRA0brkowcYMn9WfGSMjCkZ4s/wME6sl2JC9sQjaT0/1DHd6aCkjg\nJ23nlyflw3FpGpnD2NCzWHHo\n-----END PRIVATE KEY-----\n',
    client_email: 'firebase-adminsdk-fbsvc@skilldex-d571f.iam.gserviceaccount.com',
    client_id: '115806270039670699964',
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url:
        'https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40skilldex-d571f.iam.gserviceaccount.com',
    universe_domain: 'googleapis.com',
};

if (!admin.apps.length)
    admin.initializeApp({
        credential: admin.credential.cert(firebaseAdmin as any),
    });

export const queueManager = onValueWritten(
    {
        ref: '/queue/{gameId}',
        region: 'europe-west1',
        timeoutSeconds: 125
    },
    async (event) => {
        const gameId = Number(event.params.gameId) as number;
        const queueData = event.data.after.val();
        if (!queueData || isNaN(gameId)) return null;

        const timeoutMs = 2 * 60 * 1000;
        const timeoutTime = queueData.timestamp + timeoutMs;
        const now = Date.now();
        const delayMs = timeoutTime - now;

        if (delayMs > 0) await new Promise((resolve) => setTimeout(resolve, delayMs));

        const queueSnapshot = await admin.database().ref(`/queue/${gameId}`).once('value');
        if (!queueSnapshot.exists()) return null;

        const db = admin.firestore();
        const lobbySnapshot = await db.collection('games').where('gameId', '==', gameId).get();

        if (!lobbySnapshot.empty) {
            const data = lobbySnapshot.docs[0].data();
            if (data.opponent) await admin.database().ref(`/queue/${gameId}`).remove();
        }

        return null;
    }
);
