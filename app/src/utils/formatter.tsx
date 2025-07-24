import { Gamepad2 } from 'lucide-react';

import { LAMPORTS_PER_SOL, PublicKey } from '@solana/web3.js';

import { games } from '@/content/games';
import taunts from '@/content/taunts';

import { getTokenName, LobbyDisplayStatus, Token } from '@/types/utils';
import { GameState, GameType, getGameName, Lobby } from '@/types/games';
import { Timestamp } from '@/types/utils';

export const formatTokenAmount = (amount: number | BigInt, token: Token): number => {
    switch (token) {
        case Token.SOL:
            return Number(amount) / LAMPORTS_PER_SOL;
    }
};

export const formatWallet = (wallet: string) => {
    if (!wallet) return 'N/A';
    return `${wallet.substring(0, 5)}...${wallet.substring(wallet.length - 5)}`;
};

export const GameIcon = ({ id }: { id: GameType }) => {
    const gameDefinition = games.find((g) => g.id == id);
    const className = 'inline h-5 w-5 mr-2 rounded-sm shrink-0';

    return gameDefinition ? (
        <gameDefinition.icon className={className} />
    ) : (
        <Gamepad2 className={className} />
    );
};

export function getLobbyDisplayStatus(lobby: Lobby): LobbyDisplayStatus {
    if (lobby.state == GameState.Open) {
        return lobby.creator.txSignature
            ? { text: 'Open', variant: 'default' }
            : { text: 'Initializing', variant: 'secondary' };
    }

    if (lobby.state == GameState.Active) {
        return lobby.opponent && !lobby.opponent.txSignature
            ? { text: 'Opponent Staking', variant: 'secondary' }
            : { text: 'In Play', variant: 'default' };
    }

    return { text: 'Finished', variant: 'outline' };
}

export function formatExpirationTime(expirationTime?: Timestamp): string {
    return expirationTime
        ? new Date(expirationTime).toLocaleTimeString([], {
              hour: '2-digit',
              minute: '2-digit',
              day: '2-digit',
              month: 'short',
          })
        : 'N/A';
}

export function isValidSolanaPublicKey(publicKey: string): boolean {
    try {
        new PublicKey(publicKey);
        return true;
    } catch (error) {
        return false;
    }
}

export function convertGameType(game: GameType) {
    switch (game) {
        case GameType.TicTacToe:
            return { ticTackToe: {} };
        case GameType.Checkers:
            return { checkers: {} };
        case GameType.Reversi:
            return { reversi: {} };
        case GameType.ConnectFour:
            return { connectFour: {} };
    }
}

export function generateTaunt(
    creatorWallet: string,
    stakeLamports: number,
    token: Token,
    gameType: GameType,
    link: string
): string {
    const random = Math.floor(Math.random() * 5);
    const taunt = taunts[random];
    return taunt
        .replace('{creator}', creatorWallet)
        .replace('{stakeAmount}', (stakeLamports / LAMPORTS_PER_SOL).toFixed(2))
        .replace('{token}', getTokenName(token))
        .replace('{gameName}', getGameName(gameType))
        .replace('{link}', link);
}

export function convertTurnTimeLeft(timeLeft: number): string {
    const seconds = Math.floor(timeLeft / 1000);

    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    return [hrs, mins, secs].map((unit) => String(unit).padStart(2, '0')).join(':');
}
