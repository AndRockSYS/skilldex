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
    startAfter,
    updateDoc,
} from 'firebase/firestore';
import { get, getDatabase, ref, update, remove } from 'firebase/database';

import config from '@/config/firebase.json';
import { QUEUE_TIME_LIMIT } from '@/utils/constants';

import { GameState, Lobby, QueuePlayer } from '@/types/games';
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
        let lobbiesQuery = query(
            collection(this.firestore, 'games'),
            orderBy('createdAt', 'desc'),
            limit(5)
        );

        if (lastGameId) lobbiesQuery = query(lobbiesQuery, startAfter(lastGameId));

        const snapshot = await getDocs(lobbiesQuery);
        return snapshot.docs.map((snap) => snap.data()) as Lobby[];
    }

    static async addOpponent(gameId: number, opponent: Player) {
        const opponentRef = doc(this.firestore, 'games', gameId.toString());
        await updateDoc(opponentRef, { opponent, state: GameState.Active });
    }

    static async updateWinner(gameId: number, winner: string) {
        await updateDoc(doc(this.firestore, 'games', gameId.toString()), {
            winner,
            state: GameState.Finished,
        });
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
        if (
            !snapshot.exists() ||
            (snapshot.exists() && snapshot.val().timestamp + QUEUE_TIME_LIMIT > Date.now())
        ) {
            await update(gameRef, { wallet, timestamp: Date.now() });
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
