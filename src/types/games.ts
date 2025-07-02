import { LucideIcon } from 'lucide-react';
import type { Timestamp } from 'firebase/firestore';
import { Token } from './utils';

export type GameDefinition = {
    id: GameType;
    name: string;
    icon: LucideIcon;
};

export enum GameState {
    Open,
    Active,
    Finished,
}

export enum GameType {
    TicTacToe,
    RockPaperScissors,
    FourInARow,
}

export const getGameName = (game: GameType): string => {
    switch (game) {
        case GameType.TicTacToe:
            return 'Tic Tac Toe';
        case GameType.RockPaperScissors:
            return 'Rock Paper Scissors';
        case GameType.FourInARow:
            return 'Four in a Row';
    }
};

export enum MatchFormat {
    Single,
    BestOf3,
    BestOf5,
}

export const getMatchFormatName = (format: MatchFormat): string => {
    switch (format) {
        case MatchFormat.Single:
            return 'Single';
        case MatchFormat.BestOf3:
            return 'Best of 3';
        case MatchFormat.BestOf5:
            return 'Best of 5';
    }
};

export interface Lobby {
    id: number;
    state: GameState;
    gameType: GameType;
    format: MatchFormat;

    pool: {
        initial: number;
        amount: number;
        token: Token;
    };

    creator: {
        wallet: string;
        score?: number;
        lastEmoji?: { emoji: string; timestamp: Timestamp };
    };
    opponent?: {
        wallet: string;
        score?: number;
        lastEmoji?: { emoji: string; timestamp: Timestamp };
    };
    winner?: string;

    signature: {
        creation?: string;
        join?: string;
    };

    turn: {
        currentPlayerWallet: string;
        turnStartTimestamp: Timestamp;
        turnTimeLimit: number;
    };
    score: {
        creator: number;
        opponent: number;
    };

    createdAt: Timestamp;
    expirationTime?: Timestamp;
}
