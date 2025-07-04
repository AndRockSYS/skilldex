import type { Timestamp } from 'firebase/firestore';

export interface UserStats {
    walletAddress: string;

    name?: string;
    avatar?: string;

    points: number;

    games: {
        created: number;
        played: number;
        won: number;
    };

    notifications: {
        gameSound: boolean;
        browser: boolean;
        email?: string;
    };

    lastActivity: Timestamp;
}

export function getRank(points: number): string {
    // todo add ranks
    return 'N/A';
}

export enum PlayerStatus {
    Online,
    Disconnected,
    Thinking,
    Waiting,
    AI,
}

export function getStatusName(status: PlayerStatus): string {
    switch (status) {
        case PlayerStatus.Online:
            return 'Online';
        case PlayerStatus.Disconnected:
            return 'Disconnected';
        case PlayerStatus.Thinking:
            return 'Thinking';
        case PlayerStatus.Waiting:
            return 'Waiting';
        case PlayerStatus.AI:
            return 'AI';
    }
}

export interface Player {
    wallet: string;
    name?: string;
    avatar?: string;
    score: number;
    txSignature: string;
}
