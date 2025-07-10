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

import { GameState, Lobby, QueuePlayer, Reaction, Turn } from '@/types/games';
import { Player } from '@/types/user';
import { FlaggedGame } from '@/types/admin';

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

    static async updateTurn(gameId: number, playerWallet: string) {
        const turnRef = ref(this.database, `/turns/${gameId}`);
        await update(turnRef, { playerWallet, turnStart: Date.now() });
    }

    static async updateScore(gameId: number, side: 'creator' | 'opponent', newScore: number) {
        const lobbyRef = doc(this.firestore, 'games', gameId.toString());
        await updateDoc(lobbyRef, { [`${side}.score`]: newScore });
    }

    static async fetchTurn(gameId: number): Promise<Turn> {
        const turnRef = ref(this.database, `/turns/${gameId}`);
        const snapshot = await get(turnRef);
        if (!snapshot.exists()) throw new Error('No turn was found');
        return snapshot.val();
    }

    static async addEmoji(gameId: number, side: 'creator' | 'opponent', emoji: string) {
        const reaction: Reaction = {
            sender: side,
            emoji,
            timestamp: Date.now(),
        };

        const reactionRef = ref(this.database, `/emojis/${gameId}/${reaction.timestamp}`);
        await update(reactionRef, reaction);
    }

    static async fetchEmojis(gameId: number): Promise<Reaction[]> {
        const reactionsRef = ref(this.database, `/emojis/${gameId}`);
        const data = await get(reactionsRef);
        return Object.values(data).sort((a, b) => a.timestamp - b.timestamp);
    }

    static async sendGameReport(report: FlaggedGame) {
        const reportsRef = doc(this.firestore, 'reports');
        await setDoc(reportsRef, report);
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
