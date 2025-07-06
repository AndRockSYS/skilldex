import { Timestamp } from 'firebase/firestore';

export type ModerationAction = 'warn' | 'ban' | 'unban';

export interface Moderation {
    wallet: string;
    action: ModerationAction;
    reason: string;
    createdAt: Timestamp;
}

export type FlaggedGameStatus = 'open' | 'resolved' | 'investigating';

export interface FlaggedGame {
    id: string;
    gameId: number;
    reason: string;
    reporterWallet?: string;
    flaggedAt: Timestamp;
    status: FlaggedGameStatus;
}

export interface Announcement {
    id: string;
    title: string;
    content: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
}

export interface Statistics {
    games: {
        open: number;
        active: number;
        finished: number;
    };
    totalStake: number;
}

export interface AdminPageData {
    stats: Statistics;
    moderationList: Moderation[];
    flaggedGames: FlaggedGame[];
    announcements: Announcement[];
}
