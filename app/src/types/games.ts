import { LucideIcon } from 'lucide-react';

import { Timestamp, Token } from './utils';
import { Player } from './user';

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

export const getStateName = (state: GameState): string => {
    switch (state) {
        case GameState.Open:
            return 'Open';
        case GameState.Active:
            return 'Active';
        case GameState.Finished:
            return 'Finished';
    }
};

export enum GameType {
    TicTacToe,
    ConnectFour,
    RockPaperScissors,
}

export const getGameName = (game: GameType): string => {
    switch (game) {
        case GameType.TicTacToe:
            return 'Tic Tac Toe';
        case GameType.RockPaperScissors:
            return 'Rock Paper Scissors';
        case GameType.ConnectFour:
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
        token: Token;
    };

    creator: Player;
    opponent?: Player;
    winner?: string;

    timeLimit: number;
    createdAt: Timestamp;
    expirationTime: Timestamp;
}

export interface QueuePlayer {
    wallet: string;
    timestamp: Timestamp;
}

export interface Turn {
    turnStart: Timestamp;
    playerWallet: string;
}

export interface Reaction {
    sender: string;
    emoji: string;
    timestamp: Timestamp;
}
