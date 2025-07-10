import { initializeApp } from 'firebase/app';
import {
    collection,
    doc,
    getDoc,
    getDocs,
    getFirestore,
    limit,
    orderBy,
    query,
    setDoc,
    updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, getStorage, ref, uploadString } from 'firebase/storage';
import { getAuth, signInWithCustomToken } from 'firebase/auth';

import { generateCustomToken } from './admin';

import config from '@/config/firebase.json';

import { generateUID } from '@/utils/generator';

import { UserStats } from '@/types/user';
import { Announcement } from '@/types/admin';

export default class AppDatabase {
    static app = initializeApp(config);
    static firestore = getFirestore(this.app);
    static storage = getStorage(this.app);
    static isAuthed = false;

    private static async authenticate(publicKey: string) {
        const auth = getAuth(this.app);
        const token = await generateCustomToken(publicKey);
        await signInWithCustomToken(auth, token);

        this.isAuthed = true;
    }

    static async createUser(publicKey: string): Promise<UserStats> {
        if (!this.isAuthed) await this.authenticate(publicKey);
        const userRef = doc(this.firestore, 'users', publicKey);
        const newUser = {
            walletAddress: publicKey,
            points: 0,
            avatar: 'https://placehold.co/128x128.png',
            games: {
                created: 0,
                played: 0,
                won: 0,
            },
            notifications: {
                gameSound: true,
                browser: true,
            },
            lastActivity: Date.now(),
        };
        await setDoc(userRef, newUser);
        return newUser;
    }

    static async fetchUser(publicKey: string): Promise<UserStats> {
        const userRef = doc(this.firestore, 'users', publicKey);
        const snapshot = await getDoc(userRef);
        if (snapshot.exists()) return snapshot.data() as UserStats;
        return await this.createUser(publicKey);
    }

    static async updateUser(user: UserStats) {
        if (!this.isAuthed) await this.authenticate(user.walletAddress);
        const userRef = doc(this.firestore, 'users', user.walletAddress);
        await updateDoc(userRef, user as any);
    }

    static async uploadAvatar(wallet: string, avatar: string) {
        if (!this.isAuthed) await this.authenticate(wallet);

        const storageRef = ref(this.storage, `avatars/${wallet}-${Date.now()}`);

        let contentType = 'image/png';
        if (avatar.startsWith('data:image/jpeg')) contentType = 'image/jpeg';
        else if (avatar.startsWith('data:image/gif')) contentType = 'image/gif';

        const metadata = {
            contentType,
        };

        const result = await uploadString(storageRef, avatar, 'data_url', metadata);
        return await getDownloadURL(result.ref);
    }

    static async fetchLeaderboard(): Promise<UserStats[]> {
        const leaederboardQuery = query(
            collection(this.firestore, 'users'),
            orderBy('points', 'desc'),
            limit(25)
        );

        const snapshot = await getDocs(leaederboardQuery);
        return snapshot.docs.map((snap) => snap.data()) as UserStats[];
    }

    static async fetchAnnouncements(): Promise<Announcement[]> {
        const announcementsQuery = query(
            collection(this.firestore, 'announcements'),
            orderBy('createdAt', 'desc'),
            limit(5)
        );

        const snapshot = await getDocs(announcementsQuery);
        return snapshot.docs.map((snap) => snap.data()) as Announcement[];
    }

    static async createGameReport(
        gameId: number,
        reason: string,
        reporterWallet?: string
    ): Promise<string> {
        const report = {
            id: generateUID(gameId),
            gameId,
            reason,
            reporterWallet,
            flaggedAt: Date.now(),
            status: 'open',
        };

        const reportsRef = doc(this.firestore, 'reports', report.id);
        await setDoc(reportsRef, report);

        return report.id;
    }
}
