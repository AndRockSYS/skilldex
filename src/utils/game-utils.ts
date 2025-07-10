import { Lobby, MatchFormat } from '@/types/games';
import { Player } from '@/types/user';

export function findSeriesWinner({ format, creator, opponent }: Lobby): string | null {
    const inGameOpponent = opponent as Player;

    const targetScore = format == MatchFormat.BestOf3 ? 2 : format == MatchFormat.BestOf5 ? 3 : 1;
    if (creator.score >= targetScore) return creator.wallet;
    if (inGameOpponent.score >= targetScore) return inGameOpponent.wallet;

    return null;
}
