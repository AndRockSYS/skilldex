'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import GameDatabase from '@/lib/firebase/games';

import { GAME_SETTINGS } from '@/utils/constants';

import { Lobby, Turn } from '@/types/games';

const initialBoard: Board = Array(GAME_SETTINGS.connectFour.rows)
    .fill('none')
    .map(() => Array(GAME_SETTINGS.connectFour.columns).fill('none'));

type Side = 'creator' | 'opponent' | 'none';
type Board = Side[][];

interface Props {
    lobby: Lobby;
    turn: Turn | undefined;
    endTurn: (winnerSide?: 'creator' | 'opponent') => Promise<void>;
}

export default function ConnectFour({ lobby, turn, endTurn }: Props) {
    const { data: board } = useQuery({
        queryKey: ['gameData', 'connectFour'],
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

    const isTie = useMemo(() => board.every((row) => row.every((cell) => cell != 'none')), [board]);

    const handleColumnClick = useCallback(
        async (col: number) => {
            if (isPlaced.current || publicKey?.toString() != turn?.playerWallet) return;
            isPlaced.current = true;

            const newBoard: Board = board.map((row) => [...row]);

            for (let row = GAME_SETTINGS.connectFour.rows - 1; row >= 0; row--) {
                if (newBoard[row][col] == 'none') {
                    newBoard[row][col] = currentSide;

                    await GameDatabase.uploadGameData(lobby.id, newBoard);

                    if (hasWinner(row, col)) await endTurn(currentSide);
                    else if (isTie) {
                        // todo handle tie
                    } else await endTurn();

                    break;
                }
            }
        },
        [board, currentSide, publicKey, turn, isTie]
    );

    return (
        <div className='flex flex-col items-center p-4 '>
            <div className='grid gap-2 bg-blue-800 p-4 rounded-lg'>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className='flex gap-2'>
                        {row.map((cell, colIndex) => (
                            <button
                                key={colIndex}
                                onClick={() => handleColumnClick(colIndex)}
                                className=' rounded-full bg-white flex items-center justify-center'
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
