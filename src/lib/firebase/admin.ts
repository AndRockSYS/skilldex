'use server';

import admin from 'firebase-admin';

import { AdminPageData, FlaggedGame, FlaggedGameStatus, Announcement } from '@/types/admin';
import { ModerationForm } from '../zod';

import { Timestamp } from 'firebase/firestore';

import { revalidatePath } from 'next/cache';
import { isValidSolanaPublicKey } from '@/utils/formatter';
import { generateUID } from '@/utils/generator';

if (!admin.apps.length) {
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey,
        }),
        databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
}

const firestore = admin.firestore();

export async function generateCustomToken(publicKey: string): Promise<string> {
    if (isValidSolanaPublicKey(publicKey)) return await admin.auth().createCustomToken(publicKey);
    throw new Error('Invalid Public Key');
}

export async function verifyPassword(password: string): Promise<boolean> {
    const snapshot = await firestore.doc(`/admin/password`).get();
    if (!snapshot.exists) return false;
    return snapshot.data()?.password == password;
}

export async function fetchAdminData(): Promise<AdminPageData> {}

export async function addModerationAction(form: ModerationForm) {
    // * has not history, will rewrite
    const moderation = {
        ...form,
        createdAt: Timestamp.now(),
    };
    await firestore.doc(`/moderations/${moderation.wallet}`).set(moderation);
}

export async function resolveFlaggedGame(flagId: string, status: FlaggedGameStatus) {
    const snapshot = await firestore.doc(`/reports/${flagId}`).get();

    const report = snapshot.data() as FlaggedGame;
    report.status = status;

    await firestore.doc(`/reports/${flagId}`).update(report as any);
}

export async function createAnnouncement(title: string, content: string) {
    const announcement = {
        id: generateUID(title),
        title,
        content,
        createdAt: Timestamp.now(),
    };

    await firestore.doc(`/announcements/${announcement.id}`).set(announcement);
}

export async function updateAnnouncement(id: string, title: string, content: string) {
    const snapshot = await firestore.doc(`/announcements/${id}`).get();

    const ann = snapshot.data() as Announcement;
    ann.title = title;
    ann.content = content;

    await firestore.doc(`/announcements/${ann.id}`).update(ann as any);
}

export async function deleteAnnouncement(id: string) {
    await firestore.doc(`/announcements/${id}`).delete();
}
