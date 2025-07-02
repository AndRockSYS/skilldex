import { Timestamp } from 'firebase/firestore';

export type ModerationAction = 'warn' | 'ban' | 'unban';

export interface ModerationActionDetails {
    action: ModerationAction;
    reason: string;
    timestamp: Timestamp;
    moderatorId?: string;
}

export interface ModerationEntry {
    wallet: string;
    currentStatus: ModerationAction;
    lastReason?: string;
    lastUpdatedAt: Timestamp;
    moderationHistory: ModerationActionDetails[];
}

export interface FlaggedGameEntry {
    id: string;
    gameId: number;
    reason: string;
    reporterWallet?: string;
    flaggedAt: Timestamp;
    status: 'open' | 'resolved' | 'investigating';
    resolutionNotes?: string;
}

export interface AnnouncementEntry {
    id: string;
    title: string;
    content: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    isVisible: boolean;
}

export interface StatisticsEntry {
    totalChallenges: number;
    openChallenges: number;
    inPlayChallenges: number;
    finishedChallenges: number;
    totalStakeValue: number;
    totalPlatformFeesEarned: number;
    statusDistribution: Array<{ name: string; value: number }>;
}

export interface AdminPageData {
    stats: StatisticsEntry;
    platformWallet: string;
    moderationList: ModerationEntry[];
    flaggedGames: FlaggedGameEntry[];
    announcements: AnnouncementEntry[];
}
