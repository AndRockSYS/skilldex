'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import GameDatabase from '@/lib/firebase/games';

import { Lobby, Turn } from '@/types/games';

const initialBoard: Board = Array(3)
    .fill('none')
    .map(() => Array(3).fill('none'));

type Player = 'creator' | 'opponent' | 'none';
type Board = Player[][];

interface Props {
    lobby: Lobby;
    turn: Turn | undefined;
    endTurn: (winnerSide?: 'creator' | 'opponent') => Promise<void>;
}

export default function TicTacToe({ lobby, turn, endTurn }: Props) {
    const { data: board } = useQuery({
        queryKey: ['gameData', 'ticTacToe'],
        queryFn: async () => await GameDatabase.fetchGameData<Board>(lobby.id),
        initialData: initialBoard,
        refetchInterval: 1_000,
    });

    const { publicKey } = useWallet();
    const currentSide = useMemo(
        () => (lobby.creator.wallet == turn?.playerWallet ? 'creator' : 'opponent'),
        [lobby, turn]
    );

    const isPlaced = useRef(false);
    useEffect(() => {
        if (publicKey?.toString() == turn?.playerWallet) isPlaced.current = false;
    }, [publicKey, turn]);

    const hasWinner = useCallback(() => {
        for (let row = 0; row < 3; row++) {
            if (
                board[row][0] == currentSide &&
                board[row][1] == currentSide &&
                board[row][2] == currentSide
            ) {
                return true;
            }
        }
        for (let col = 0; col < 3; col++) {
            if (
                board[0][col] == currentSide &&
                board[1][col] == currentSide &&
                board[2][col] == currentSide
            ) {
                return true;
            }
        }
        if (
            board[0][0] == currentSide &&
            board[1][1] == currentSide &&
            board[2][2] == currentSide
        ) {
            return true;
        }
        if (
            board[0][2] == currentSide &&
            board[1][1] == currentSide &&
            board[2][0] == currentSide
        ) {
            return true;
        }
        return false;
    }, [board, currentSide]);

    const isTie = useMemo(() => board.every((row) => row.every((cell) => cell != 'none')), [board]);

    const handleCellClick = useCallback(
        async (row: number, col: number) => {
            if (
                isPlaced.current ||
                publicKey?.toString() != turn?.playerWallet ||
                board[row][col] != 'none'
            )
                return;
            isPlaced.current = true;

            const newBoard: Board = board.map((r) => [...r]);
            newBoard[row][col] = currentSide;

            await GameDatabase.uploadGameData(lobby.id, newBoard);

            console.log(hasWinner());
            if (hasWinner()) await endTurn(currentSide);
            else if (isTie) {
                // todo handle tie
            } else await endTurn();
        },
        [board, isTie, publicKey, turn, currentSide]
    );

    return (
        <div className='flex flex-col items-center p-4'>
            <div className='grid gap-2 bg-blue-800 p-4 rounded-lg'>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className='flex gap-2'>
                        {row.map((cell, colIndex) => (
                            <button
                                key={colIndex}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                className='w-16 h-16 bg-white flex items-center justify-center text-2xl font-bold'
                            >
                                <span
                                    className={`${
                                        cell == 'creator'
                                            ? 'text-blue-600'
                                            : cell == 'opponent'
                                            ? 'text-orange-600'
                                            : ''
                                    }`}
                                >
                                    {cell == 'creator' ? 'O' : 'X'}
                                </span>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
