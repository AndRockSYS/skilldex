'use server';

import admin from 'firebase-admin';

import AppDatabase from './client';

import firebaseAdmin from '@/config/firebase-admin.json';

import { isValidSolanaPublicKey } from '@/utils/formatter';
import { generateUID } from '@/utils/generator';

import { ModerationForm } from '../zod';
import { FieldPath, AggregateField } from 'firebase-admin/firestore';
import {
    AdminPageData,
    FlaggedGame,
    FlaggedGameStatus,
    Announcement,
    Moderation,
} from '@/types/admin';

if (!admin.apps.length)
    admin.initializeApp({
        credential: admin.credential.cert(firebaseAdmin as any),
    });

const firestore = admin.firestore();

export async function generateCustomToken(publicKey: string): Promise<string> {
    if (isValidSolanaPublicKey(publicKey)) return await admin.auth().createCustomToken(publicKey);
    throw new Error('Invalid Public Key');
}

export async function verifyPassword(password: string): Promise<boolean> {
    const snapshot = await firestore.doc(`/admin/password`).get();
    return snapshot.exists && snapshot.data()?.password == password;
}

export async function fetchAdminData(): Promise<AdminPageData> {
    const modList = await firestore.collection(`moderations`).orderBy('createdAt', 'desc').get();
    const reports = await firestore.collection(`reports`).orderBy('flaggedAt', 'desc').get();
    const announcements = await AppDatabase.fetchAnnouncements();

    const openGames = await firestore
        .collection('games')
        .where('opponent', '==', null)
        .count()
        .get();
    const activeGames = await firestore
        .collection('games')
        .where('opponent', '!=', null)
        .where('winner', '==', null)
        .count()
        .get();
    const finishedGames = await firestore
        .collection('games')
        .where('winner', '!=', null)
        .count()
        .get();

    const stakes = await firestore
        .collection('games')
        .where('winner', '!=', null)
        .aggregate({ totalStake: AggregateField.sum(new FieldPath('pool.amount')) })
        .get();

    return {
        stats: {
            games: {
                open: openGames.data().count,
                active: activeGames.data().count,
                finished: finishedGames.data().count,
            },
            totalStake: stakes.data().totalStake,
        },
        moderationList: modList.docs.map((doc) => doc.data()) as Moderation[],
        flaggedGames: reports.docs.map((doc) => doc.data()) as FlaggedGame[],
        announcements,
    };
}

export async function addModerationAction(form: ModerationForm) {
    // * has not history, will rewrite
    const moderation = {
        ...form,
        createdAt: Date.now(),
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
        createdAt: Date.now(),
    };

    await firestore.doc(`/announcements/${announcement.id}`).set(announcement);
}

export async function updateAnnouncement(id: string, title: string, content: string) {
    const snapshot = await firestore.doc(`/announcements/${id}`).get();

    const ann = snapshot.data() as Announcement;
    ann.title = title;
    ann.content = content;
    ann.updatedAt = Date.now();

    await firestore.doc(`/announcements/${ann.id}`).update(ann as any);
}

export async function deleteAnnouncement(id: string) {
    await firestore.doc(`/announcements/${id}`).delete();
}
