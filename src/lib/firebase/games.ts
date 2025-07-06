import { initializeApp } from 'firebase/app';
import { doc, getDoc, getFirestore, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import { get, getDatabase, ref, update, remove } from 'firebase/database';

import config from '@/config/firebase.json';
import { QUEUE_TIME_LIMIT } from '@/utils/constants';

import { Lobby, QueuePlayer } from '@/types/games';
import { Player } from '@/types/user';

export default class GameDatabase {
    static app = initializeApp(config);
    static database = getDatabase(this.app);
    static firestore = getFirestore(this.app);

    static async createLobby(lobby: Lobby) {
        const gameRef = doc(this.firestore, 'games', lobby.id.toString());
        await setDoc(gameRef, lobby as any);
    }

    static async fetchLobbyById(gameId: number): Promise<Lobby> {
        const gameRef = doc(this.firestore, 'games', gameId.toString());
        const snapshot = await getDoc(gameRef);

        if (!snapshot.exists()) throw new Error('Game with provided id does not exist.');
        return snapshot.data() as Lobby;
    }

    static async fetchLobbies(lastGameId?: number): Promise<Lobby[]> {
        // todo with custom queries ?
        return [];
    }

    static async addOpponent(gameId: number, opponent: Player) {
        const opponentRef = doc(this.firestore, 'games', gameId.toString(), 'opponent');
        await updateDoc(opponentRef, opponent as any);
    }

    static async updateWinner(gameId: number, opponent: Player) {
        await updateDoc(doc(this.firestore, 'games', gameId.toString(), 'winner'), opponent as any);
    }

    static async updateTurn() {
        // todo when adding games
        // turn: {
        //     playerWallet: string;
        //     startTimestamp: Timestamp;
        // }
    }

    static async addEmoji(gameId: number, side: 'creator' | 'opponent', emoji: string) {
        // todo when adding games
        // {
        //     emoji: string;
        //     timestamp: Timestamp;
        // }
    }

    static fetchEmojis(gameId: number) {
        // todo when adding games
    }

    static async enqueue(
        gameId: number,
        wallet: string
    ): Promise<{
        success: boolean;
        message: string;
    }> {
        const gameRef = ref(this.database, `/queue/${gameId}`);

        const snapshot = await get(gameRef);
        const userData = snapshot.val() as QueuePlayer;
        if (
            !snapshot.exists() ||
            (snapshot.exists() && userData.timestamp.toMillis() + QUEUE_TIME_LIMIT > Date.now())
        ) {
            const updates: any = {};
            updates[`/queue/${gameId}`] = { wallet, timestamp: Timestamp.now() };
            await update(gameRef, updates);
            return { success: true, message: 'User was added to a queue' };
        }

        return { success: false, message: 'Queue is full' };
    }

    static async dequeue(gameId: number) {
        const gameRef = ref(this.database, `/queue/${gameId}`);
        await remove(gameRef);
    }

    static async fetchQueue(gameId: number): Promise<QueuePlayer> {
        const gameRef = ref(this.database, `/queue/${gameId}`);
        const snapshot = await get(gameRef);
        return snapshot.val() as QueuePlayer;
    }
}
