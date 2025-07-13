'use client';

import { useCallback, useEffect, useMemo, useRef } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import { Circle, Crown } from 'lucide-react';

import GameDatabase from '@/lib/firebase/games';

import { Lobby, Turn } from '@/types/games';

type Piece = 'creator' | 'creator-king' | 'opponent' | 'opponent-king' | 'none';
type Board = Piece[][];

const createInitialBoard = () => {
    const initialBoard: Board = Array(8)
        .fill('none')
        .map(() => Array(8).fill('none'));

    for (let row = 0; row < 3; row++) {
        for (let col = row % 2 ? 0 : 1; col < 8; col += 2) {
            initialBoard[row][col] = 'opponent';
        }
    }
    for (let row = 5; row < 8; row++) {
        for (let col = row % 2 ? 0 : 1; col < 8; col += 2) {
            initialBoard[row][col] = 'creator';
        }
    }

    return initialBoard;
};

interface Props {
    lobby: Lobby;
    turn: Turn | undefined;
    endTurn: (winnerSide?: 'creator' | 'opponent' | 'tie') => Promise<void>;
}

export default function Checkers({ lobby, turn, endTurn }: Props) {
    const { data: board } = useQuery({
        queryKey: ['gameData', 'checkers'],
        queryFn: async () => await GameDatabase.fetchGameData<Board>(lobby.id),
        initialData: createInitialBoard(),
        refetchInterval: 1_000,
    });

    const { publicKey } = useWallet();
    const currentSide = useMemo(
        () => (lobby.creator.wallet === turn?.playerWallet ? 'creator' : 'opponent'),
        [lobby, turn]
    );

    const isPlaced = useRef(false);
    const selectedPiece = useRef<{ row: number; col: number } | null>(null); // Moved useRef here

    useEffect(() => {
        if (publicKey?.toString() === turn?.playerWallet) isPlaced.current = false;
    }, [publicKey, turn]);

    const isValidMove = useCallback(
        (fromRow: number, fromCol: number, toRow: number, toCol: number) => {
            if (board[toRow][toCol] !== 'none') return false;

            const piece = board[fromRow][fromCol];
            const rowDiff = toRow - fromRow;
            const colDiff = Math.abs(toCol - fromCol);
            const isKing = piece.includes('king');

            const isRegularMove =
                colDiff === 1 &&
                ((piece === 'creator' && rowDiff === -1) ||
                    (piece === 'opponent' && rowDiff === 1) ||
                    (isKing && Math.abs(rowDiff) === 1));

            const isJumpMove =
                colDiff === 2 &&
                ((piece === 'creator' && rowDiff === -2) ||
                    (piece === 'opponent' && rowDiff === 2) ||
                    (isKing && Math.abs(rowDiff) === 2));

            if (isJumpMove) {
                const midRow = (fromRow + toRow) / 2;
                const midCol = (fromCol + toCol) / 2;
                const midPiece = board[midRow][midCol];
                return midPiece !== 'none' && !midPiece.includes(currentSide);
            }

            return isRegularMove;
        },
        [board, currentSide]
    );

    const hasWinner = useCallback(() => {
        const creatorPieces = board.flat().filter((p) => p.includes('creator')).length;
        const opponentPieces = board.flat().filter((p) => p.includes('opponent')).length;
        return creatorPieces === 0 || opponentPieces === 0;
    }, [board]);

    const isTie = useMemo(() => {
        for (let row = 0; row < 8; row++) {
            for (let col = 0; col < 8; col++) {
                if (board[row][col].includes(currentSide)) {
                    const directions = board[row][col].includes('king')
                        ? [
                              [1, 1],
                              [1, -1],
                              [-1, 1],
                              [-1, -1],
                          ]
                        : currentSide === 'creator'
                        ? [
                              [-1, 1],
                              [-1, -1],
                          ]
                        : [
                              [1, 1],
                              [1, -1],
                          ];

                    for (const [dr, dc] of directions) {
                        if (
                            isValidMove(row, col, row + dr, col + dc) ||
                            isValidMove(row, col, row + 2 * dr, col + 2 * dc)
                        ) {
                            return false;
                        }
                    }
                }
            }
        }
        return true;
    }, [board, currentSide, isValidMove]);

    const handleCellClick = useCallback(
        async (row: number, col: number) => {
            if (isPlaced.current || publicKey?.toString() !== turn?.playerWallet) return;

            if (board[row][col].includes(currentSide)) {
                selectedPiece.current = { row, col };
                return;
            }

            if (
                selectedPiece.current &&
                isValidMove(selectedPiece.current.row, selectedPiece.current.col, row, col)
            ) {
                isPlaced.current = true;
                const newBoard: Board = board.map((r) => [...r]);
                const { row: fromRow, col: fromCol } = selectedPiece.current;
                const piece = newBoard[fromRow][fromCol];

                newBoard[row][col] = piece;
                newBoard[fromRow][fromCol] = 'none';

                if (Math.abs(row - fromRow) === 2) {
                    const midRow = (fromRow + row) / 2;
                    const midCol = (fromCol + col) / 2;
                    newBoard[midRow][midCol] = 'none';
                }

                if (
                    (currentSide === 'creator' && row === 0) ||
                    (currentSide === 'opponent' && row === 7)
                ) {
                    newBoard[row][col] = `${currentSide}-king` as Piece;
                }

                await GameDatabase.uploadGameData(lobby.id, newBoard);

                if (hasWinner()) {
                    await endTurn(currentSide);
                } else if (isTie) {
                    await endTurn('tie');
                } else {
                    await endTurn();
                }

                selectedPiece.current = null;
            }
        },
        [board, currentSide, publicKey, turn, isValidMove, hasWinner, isTie]
    );

    return (
        <div className='flex flex-col items-center p-4'>
            <div className='grid gap-1 bg-gray-800 p-4 rounded-lg'>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className='flex gap-1'>
                        {row.map((cell, colIndex) => (
                            <button
                                key={colIndex}
                                onClick={() => handleCellClick(rowIndex, colIndex)}
                                className={`w-12 h-12 flex items-center justify-center ${
                                    (rowIndex + colIndex) % 2 === 0 ? 'bg-gray-400' : 'bg-gray-600'
                                } ${lobby.winner ? 'cursor-not-allowed' : ''}`}
                                disabled={!!lobby.winner}
                            >
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                                        cell === 'creator'
                                            ? 'bg-blue-600'
                                            : cell === 'creator-king'
                                            ? 'bg-blue-800'
                                            : cell === 'opponent'
                                            ? 'bg-orange-600'
                                            : cell === 'opponent-king'
                                            ? 'bg-orange-800'
                                            : 'bg-transparent'
                                    }`}
                                >
                                    {cell === 'creator' && (
                                        <Circle className='w-6 h-6 text-white fill-current' />
                                    )}
                                    {cell === 'creator-king' && (
                                        <Crown className='w-6 h-6 text-yellow-400' />
                                    )}
                                    {cell === 'opponent' && (
                                        <Circle className='w-6 h-6 text-white fill-current' />
                                    )}
                                    {cell === 'opponent-king' && (
                                        <Crown className='w-6 h-6 text-yellow-400' />
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>
                ))}
            </div>
        </div>
    );
}
