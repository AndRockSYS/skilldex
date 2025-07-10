'use client';

import { useCallback, useMemo, useState } from 'react';

import { GAME_SETTINGS } from '@/utils/constants';

import { Lobby } from '@/types/games';

const initialBoard: Board = Array(GAME_SETTINGS.connectFour.rows)
    .fill(null)
    .map(() => Array(GAME_SETTINGS.connectFour.columns).fill(null));

type Side = 'creator' | 'opponent' | null;
type Board = Side[][];

interface Props {
    lobby: Lobby;
}

export default function ConnectFour({ lobby }: Props) {
    const [board, setBoard] = useState<Board>(initialBoard);
    const [currentSide, setCurrentSide] = useState<Side>('opponent');

    const hasWinner = useCallback(
        (row: number, col: number) => {
            const directions = [
                [0, 1],
                [1, 0],
                [1, 1],
                [1, -1],
            ];

            for (const [dr, dc] of directions) {
                let count = 1;
                for (let i = -3; i <= 3; i++) {
                    if (i == 0) continue;
                    const r = row + i * dr;
                    const c = col + i * dc;
                    if (
                        r >= 0 &&
                        r < GAME_SETTINGS.connectFour.rows &&
                        c >= 0 &&
                        c < GAME_SETTINGS.connectFour.columns &&
                        board[r][c] == currentSide
                    ) {
                        count++;
                        if (count >= 4) return true;
                    } else {
                        count = i < 0 ? 1 : count;
                    }
                }
            }

            return false;
        },
        [board, currentSide]
    );

    const isTie = useMemo(() => board.every((row) => row.every((cell) => cell !== null)), [board]);

    const handleColumnClick = useCallback(
        (col: number): void => {
            const newBoard: Board = board.map((row) => [...row]);
            let placed: boolean = false;

            for (let row = GAME_SETTINGS.connectFour.rows - 1; row >= 0; row--) {
                if (!newBoard[row][col]) {
                    newBoard[row][col] = currentSide;

                    placed = true;
                    setBoard(newBoard);

                    if (hasWinner(row, col)) {
                        // todo handle winner
                    } else if (isTie) {
                        // todo handle tie
                    } else {
                        // todo handle turn change
                    }
                    break;
                }
            }
        },
        [board, currentSide, isTie]
    );

    return (
        <div className='flex flex-col items-center p-4 bg-gray-100 min-h-screen'>
            <div className='grid gap-2 bg-blue-800 p-4 rounded-lg'>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className='flex gap-2'>
                        {row.map((cell, colIndex) => (
                            <button
                                key={colIndex}
                                onClick={() => handleColumnClick(colIndex)}
                                className='w-12 h-12 rounded-full bg-white flex items-center justify-center'
                                disabled={!!lobby.winner}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full ${
                                        cell == 'creator'
                                            ? 'bg-blue-600'
                                            : cell == 'opponent'
                                            ? 'bg-orange-600'
                                            : 'bg-gray-200'
                                    }`}
                                />
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
