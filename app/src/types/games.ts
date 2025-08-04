import { LucideIcon } from "lucide-react";

import { Timestamp, Token } from "./utils";
import { Player } from "./user";

export type GameDefinition = {
    id: GameType;
    name: string;
    icon: LucideIcon;
    thumbnail: string;
};

export enum GameState {
    Open,
    Active,
    Finished,
}

export enum TableGameState {
    Open,
    Active,
    Finished,
    User,
}

export const getStateName = (state: GameState): string => {
    switch (state) {
        case GameState.Open:
            return "Open";
        case GameState.Active:
            return "Active";
        case GameState.Finished:
            return "Finished";
    }
};

export enum GameType {
    TicTacToe,
    ConnectFour,
    Checkers,
    Reversi,
}

export const getGameName = (game: GameType): string => {
    switch (game) {
        case GameType.TicTacToe:
            return "Tic Tac Toe";
        case GameType.Checkers:
            return "Checkers";
        case GameType.ConnectFour:
            return "Four in a Row";
        case GameType.Reversi:
            return "Reversi";
    }
};

export enum MatchFormat {
    Single,
    BestOf3,
    BestOf5,
}

export const getMatchFormatName = (format: MatchFormat): string => {
    const formatted = Number(format);

    switch (formatted) {
        case MatchFormat.Single:
            return "Single";
        case MatchFormat.BestOf3:
            return "Best of 3";
        case MatchFormat.BestOf5:
            return "Best of 5";
    }

    return "N/A";
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
    expirationTime?: Timestamp;
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
