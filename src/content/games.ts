import { LayoutGrid, Columns, Scissors } from 'lucide-react';

import { GameDefinition } from '@/types/games';

export const games: GameDefinition[] = [
    { id: 'tic-tac-toe', name: 'Tic-Tac-Toe', icon: LayoutGrid },
    { id: 'four-in-a-row', name: '4 in a Row', icon: Columns },
    { id: 'rock-paper-scissors', name: 'Rock Paper Scissors', icon: Scissors },
];

export const objectives: { [key: string]: string } = {
    'tic-tac-toe':
        'Be the first to get three of your marks in a row (horizontally, vertically, or diagonally).',
    'four-in-a-row':
        'Be the first to form a horizontal, vertical, or diagonal line of four of your own discs.',
    'rock-paper-scissors':
        "Choose a hand shape that defeats your opponent's choice. Typically played in a best-of series.",
};

export const descriptions: { [key: string]: string } = {
    'tic-tac-toe': 'A classic game where two players take turns marking spaces in a 3x3 grid.',
    'four-in-a-row':
        'Players take turns dropping one of their colored discs from the top into a seven-column, six-row vertically suspended grid. The pieces fall straight down, occupying the lowest available space within the column.',
    'rock-paper-scissors':
        'A hand game usually played between two people, in which each player simultaneously forms one of three shapes: rock, paper, or scissors. Rock crushes Scissors, Scissors cuts Paper, Paper covers Rock.',
};
