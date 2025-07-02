import type { Timestamp } from 'firebase/firestore';

export interface UserStats {
    walletAddress: string;
    displayName?: string;
    avatarUrl?: string;

    rank?: number;
    points: number;

    games: {
        created: number;
        played: number;
        won: number;
    };

    lastActivity: Timestamp;
}

export enum PlayerStatus {
    Online,
    Thinking,
    Disconnected,
    AI,
    Waiting,
}

export interface ActivePlayer {
    wallet: string;

    name?: string;
    avatarUrl?: string;

    isCurrentUser: boolean;
    status: PlayerStatus;
    score: number;
}
