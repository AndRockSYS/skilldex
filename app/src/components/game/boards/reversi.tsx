'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import GameDatabase from '@/lib/firebase/games';

import { GAME_SETTINGS } from '@/utils/constants';
import { Lobby, Turn } from '@/types/games';

type Side = 'creator' | 'opponent' | 'none';
type Board = Side[][];

interface Props {
    lobby: Lobby;
    turn: Turn | undefined;
    isSpectator: boolean;
    endTurn: (winnerSide?: 'creator' | 'opponent' | 'tie') => Promise<void>;
}

const SIZE = 8;

type ValidMove = {
    move: [number, number];
    flips: [number, number][];
};

export default function Reversi({ lobby, isSpectator, turn, endTurn }: Props) {
    const { publicKey } = useWallet();

    const currentSide = useMemo(
        () => (lobby.creator.wallet === turn?.playerWallet ? 'creator' : 'opponent'),
        [lobby, turn]
    );

    const {
        data: board,
        isSuccess,
        refetch,
    } = useQuery({
        queryKey: ['gameData', 'reversi', lobby.id],
        queryFn: async () => await GameDatabase.fetchGameData<Board>(lobby.id),
        initialData: GAME_SETTINGS.reversi.initialBoard(),
        refetchInterval: 1_000,
    });

    const isPlaced = useRef(false);
    useEffect(() => {
        if (publicKey?.toString() === turn?.playerWallet) {
            isPlaced.current = false;
        }
    }, [publicKey, turn]);

    const directions = [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1],
    ];

    const getFlips = useCallback(
        (row: number, col: number, board: Board): [number, number][] => {
            if (board[row][col] !== 'none') return [];

            const flips: [number, number][] = [];

            for (const [dr, dc] of directions) {
                const path: [number, number][] = [];
                let r = row + dr;
                let c = col + dc;

                while (
                    r >= 0 &&
                    r < SIZE &&
                    c >= 0 &&
                    c < SIZE &&
                    board[r][c] !== 'none' &&
                    board[r][c] !== currentSide
                ) {
                    path.push([r, c]);
                    r += dr;
                    c += dc;
                }

                if (
                    r >= 0 &&
                    r < SIZE &&
                    c >= 0 &&
                    c < SIZE &&
                    board[r][c] === currentSide &&
                    path.length > 0
                ) {
                    flips.push(...path);
                }
            }

            return flips;
        },
        [currentSide]
    );

    const getValidMoves = useCallback(
        (board: Board): ValidMove[] => {
            const moves: ValidMove[] = [];
            for (let row = 0; row < SIZE; row++) {
                for (let col = 0; col < SIZE; col++) {
                    const flips = getFlips(row, col, board);
                    if (flips.length > 0) {
                        moves.push({ move: [row, col], flips });
                    }
                }
            }
            return moves;
        },
        [getFlips]
    );

    const [validMoves, setValidMoves] = useState<ValidMove[]>([]);
    useEffect(() => {
        setValidMoves(getValidMoves(board));
    }, [board, getValidMoves]);

    const isMoveAvailable = (row: number, col: number) =>
        validMoves.some(({ move }) => move[0] === row && move[1] === col);

    const countDiscs = (board: Board) => {
        const counts = { creator: 0, opponent: 0 };
        for (const row of board) {
            for (const cell of row) {
                if (cell === 'creator') counts.creator++;
                else if (cell === 'opponent') counts.opponent++;
            }
        }
        return counts;
    };

    const handleCellClick = useCallback(
        async (row: number, col: number) => {
            if (isPlaced.current || publicKey?.toString() !== turn?.playerWallet) return;

            const move = validMoves.find(({ move }) => move[0] === row && move[1] === col);
            if (!move) return;

            const { flips } = move;
            isPlaced.current = true;

            const newBoard: Board = board.map((r) => [...r]);
            newBoard[row][col] = currentSide;
            for (const [r, c] of flips) {
                newBoard[r][c] = currentSide;
            }

            await GameDatabase.uploadGameData(lobby.id, newBoard);

            const nextMoves = getValidMoves(newBoard).filter((m) => m.flips.length > 0);

            const discCount = countDiscs(newBoard);
            const totalPlaced = discCount.creator + discCount.opponent;
            const maxCells = SIZE * SIZE;

            if (totalPlaced === maxCells || nextMoves.length === 0) {
                if (discCount.creator > discCount.opponent) await endTurn('creator');
                else if (discCount.opponent > discCount.creator) await endTurn('opponent');
                else await endTurn('tie');
            } else {
                await endTurn();
            }

            await refetch();
        },
        [validMoves, board, currentSide, publicKey, turn, getValidMoves, endTurn, refetch]
    );

    return (
        <div className='flex flex-col items-center p-4'>
            <div className='grid gap-1 bg-green-800 p-4 rounded-lg'>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className='flex gap-1'>
                        {row.map((cell, colIndex) => (
                            <button
                                key={colIndex}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                className={`w-10 h-10 rounded-full flex items-center justify-center
                                    ${
                                        cell === 'creator'
                                            ? 'bg-blue-600'
                                            : cell === 'opponent'
                                            ? 'bg-orange-600'
                                            : 'bg-green-300'
                                    }
                                    ${
                                        isMoveAvailable(rowIndex, colIndex)
                                            ? 'ring-2 ring-yellow-300'
                                            : ''
                                    }
                                    ${lobby.winner ? 'cursor-not-allowed' : ''}`}
                                disabled={isSpectator || !isSuccess}
                            />
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
