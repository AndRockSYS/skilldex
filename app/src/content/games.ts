import { LayoutGrid, Columns, Layers, Disc } from "lucide-react";

import { GameDefinition, GameType } from "@/types/games";

export const games: GameDefinition[] = [
    {
        id: GameType.TicTacToe,
        name: "Tic-Tac-Toe",
        icon: LayoutGrid,
        thumbnail: "/images/thumbnail/tic-tac-toe.png",
    },
    {
        id: GameType.ConnectFour,
        name: "4 in a Row",
        icon: Columns,
        thumbnail: "/images/thumbnail/connect-four.png",
    },
    {
        id: GameType.Checkers,
        name: "Checkers",
        icon: Layers,
        thumbnail: "/images/thumbnail/checkers.png",
    },
    {
        id: GameType.Reversi,
        name: "Reversi",
        icon: Disc,
        thumbnail: "/images/thumbnail/reversi.png",
    },
];

export const objectives: { [key: string]: string } = {
    TicTacToe:
        "Be the first to get three of your marks in a row (horizontally, vertically, or diagonally).",
    FourInARow:
        "Be the first to form a horizontal, vertical, or diagonal line of four of your own discs.",
    Checkers:
        "Capture all of your opponent’s pieces or block them so they cannot make a move.",
    Reversi:
        "Have the majority of your color discs on the board at the end of the game.",
};

export const descriptions: { [key: string]: string } = {
    TicTacToe:
        "A classic game where two players take turns marking spaces in a 3x3 grid.",
    FourInARow:
        "Players take turns dropping one of their colored discs from the top into a seven-column, six-row vertically suspended grid. The pieces fall straight down, occupying the lowest available space within the column.",
    Checkers:
        "A two-player strategy game where opponents move diagonal pieces and jump to capture. Kings can move both forward and backward.",
    Reversi:
        "A board game played on an 8x8 grid where players take turns placing discs, flipping opponent pieces by trapping them between two of their own.",
};

export const rules: { [key: number]: string[] } = {
    [GameType.TicTacToe]: [
        "The game is played on a 3x3 grid.",
        "Two players take turns placing their symbol (X or O) in an empty square.",
        "A player wins by being the first to get 3 of their symbols in a row (horizontally, vertically, or diagonally).",
        "If all 9 squares are filled and no player has 3 in a row, the game is a draw.",
    ],
    [GameType.ConnectFour]: [
        "The game is played on a vertical 7-column, 6-row grid.",
        "Players take turns dropping colored discs into a column.",
        "The disc falls to the lowest empty space in the column.",
        "A player wins by being the first to form a line of 4 discs (horizontally, vertically, or diagonally).",
        "If all columns are filled without a 4-in-a-row, the game ends in a draw.",
    ],
    [GameType.Reversi]: [
        "The game is played on an 8x8 board with discs that are black on one side and white on the other.",
        "Each player takes turns placing their disc on the board with their color facing up.",
        "A valid move must capture at least one of the opponent’s discs by trapping it between two of the player’s discs (in a line: horizontally, vertically, or diagonally).",
        "Captured discs are flipped to the player’s color.",
        "The game ends when neither player can make a valid move.",
        "The player with the most discs of their color on the board at the end wins.",
    ],
    [GameType.Checkers]: [
        "The game is played on an 8x8 board with alternating dark and light squares.",
        "Each player starts with 12 pieces placed on the dark squares of their side.",
        "Players move their pieces diagonally forward by one square.",
        "To capture an opponent’s piece, a player jumps over it diagonally into an empty square.",
        "If a piece reaches the opponent’s back row, it is “kinged” and can move both forward and backward.",
        "A player wins by capturing all opponent pieces or blocking all possible moves.",
    ],
};
