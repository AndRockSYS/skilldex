import { Lobby, MatchFormat } from '@/types/games';
import { Player } from '@/types/user';

export function findSeriesWinner({ format, creator, opponent }: Lobby): string | null {
    const inGameOpponent = opponent as Player;

    const targetScore = format == MatchFormat.BestOf3 ? 2 : format == MatchFormat.BestOf5 ? 3 : 1;
    if (creator.score >= targetScore) return creator.wallet;
    if (inGameOpponent.score >= targetScore) return inGameOpponent.wallet;

    return null;
}

export function isTiedGame({ format, creator, opponent }: Lobby): boolean {
    if (!opponent) return false;

    if (format == MatchFormat.Single) return creator.score == opponent.score && opponent.score == 1;
    if (format == MatchFormat.BestOf3)
        return creator.score == opponent.score && opponent.score == 2;
    if (format == MatchFormat.BestOf5)
        return creator.score == opponent.score && opponent.score == 3;

    return false;
}
