import { Timestamp } from 'firebase/firestore';

// todo refactor the types

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
    totalChallenges: number;
    openChallenges: number;
    inPlayChallenges: number;
    finishedChallenges: number;
    totalStakeValue: number;
    totalPlatformFeesEarned: number;
    statusDistribution: Array<{ name: string; value: number }>;
}

export interface AdminPageData {
    stats: Statistics;
    platformWallet: string;
    moderationList: Moderation[];
    flaggedGames: FlaggedGame[];
    announcements: Announcement[];
}
