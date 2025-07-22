import { LayoutGrid, Columns, Layers, Disc } from 'lucide-react';

import { GameDefinition, GameType } from '@/types/games';

export const games: GameDefinition[] = [
    { id: GameType.TicTacToe, name: 'Tic-Tac-Toe', icon: LayoutGrid },
    { id: GameType.ConnectFour, name: '4 in a Row', icon: Columns },
    { id: GameType.Checkers, name: 'Checkers', icon: Layers },
    { id: GameType.Reversi, name: 'Reversi', icon: Disc },
];

export const objectives: { [key: string]: string } = {
    TicTacToe:
        'Be the first to get three of your marks in a row (horizontally, vertically, or diagonally).',
    FourInARow:
        'Be the first to form a horizontal, vertical, or diagonal line of four of your own discs.',
    Checkers: 'Capture all of your opponent’s pieces or block them so they cannot make a move.',
    Reversi: 'Have the majority of your color discs on the board at the end of the game.',
};

export const descriptions: { [key: string]: string } = {
    TicTacToe: 'A classic game where two players take turns marking spaces in a 3x3 grid.',
    FourInARow:
        'Players take turns dropping one of their colored discs from the top into a seven-column, six-row vertically suspended grid. The pieces fall straight down, occupying the lowest available space within the column.',
    Checkers:
        'A two-player strategy game where opponents move diagonal pieces and jump to capture. Kings can move both forward and backward.',
    Reversi:
        'A board game played on an 8x8 grid where players take turns placing discs, flipping opponent pieces by trapping them between two of their own.',
};
