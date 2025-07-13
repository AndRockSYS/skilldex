'use client';

import { Circle, Crown } from 'lucide-react';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import GameDatabase from '@/lib/firebase/games';

import { GAME_SETTINGS } from '@/utils/constants';

import { Lobby, Turn } from '@/types/games';

type Piece = 'creator' | 'creator-king' | 'opponent' | 'opponent-king' | 'none';
type Board = Piece[][];

interface Props {
    lobby: Lobby;
    turn: Turn | undefined;
    endTurn: (winnerSide?: 'creator' | 'opponent' | 'tie') => Promise<void>;
}

export default function Checkers({ lobby, turn, endTurn }: Props) {
    const { publicKey } = useWallet();
    const currentSide = useMemo(
        () => (lobby.creator.wallet === turn?.playerWallet ? 'creator' : 'opponent'),
        [lobby, turn]
    );

    const { data: board } = useQuery({
        queryKey: ['gameData', 'checkers', lobby.id],
        queryFn: async () => await GameDatabase.fetchGameData<Board>(lobby.id),
        initialData: GAME_SETTINGS.checkers.initialBoard(),
        refetchInterval: 1_000,
    });

    const [selectedPiece, setSelectedPiece] = useState<{ row: number; col: number } | null>(null);
    const [validTargets, setValidTargets] = useState<{ row: number; col: number }[]>([]);
    const isPlaced = useRef(false);

    useEffect(() => {
        if (publicKey?.toString() === turn?.playerWallet) {
            isPlaced.current = false;
        }
    }, [publicKey, turn]);

    const isValidMove = useCallback(
        (fromRow: number, fromCol: number, toRow: number, toCol: number): boolean => {
            if (toRow < 0 || toRow > 7 || toCol < 0 || toCol > 7 || board[toRow][toCol] !== 'none')
                return false;

            const piece = board[fromRow][fromCol];
            if (!piece.includes(currentSide)) return false;

            const rowDiff = toRow - fromRow;
            const colDiff = toCol - fromCol;
            const isKing = piece.includes('king');

            const isRegularMove =
                Math.abs(colDiff) === 1 &&
                ((piece === 'creator' && rowDiff === -1) ||
                    (piece === 'opponent' && rowDiff === 1) ||
                    (isKing && Math.abs(rowDiff) === 1));

            const isJumpMove =
                Math.abs(colDiff) === 2 &&
                ((piece === 'creator' && rowDiff === -2) ||
                    (piece === 'opponent' && rowDiff === 2) ||
                    (isKing && Math.abs(rowDiff) === 2));

            if (isJumpMove) {
                const midRow = fromRow + rowDiff / 2;
                const midCol = fromCol + colDiff / 2;
                const midPiece = board[midRow][midCol];
                return midPiece !== 'none' && !midPiece.includes(currentSide);
            }

            return isRegularMove;
        },
        [board, currentSide]
    );

    const getValidMoves = useCallback(
        (fromRow: number, fromCol: number) => {
            const targets: { row: number; col: number }[] = [];

            for (let dr of [-1, 1]) {
                for (let dc of [-1, 1]) {
                    if (isValidMove(fromRow, fromCol, fromRow + dr, fromCol + dc)) {
                        targets.push({ row: fromRow + dr, col: fromCol + dc });
                    }
                    if (isValidMove(fromRow, fromCol, fromRow + 2 * dr, fromCol + 2 * dc)) {
                        targets.push({ row: fromRow + 2 * dr, col: fromCol + 2 * dc });
                    }
                }
            }

            return targets;
        },
        [isValidMove]
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
                    if (getValidMoves(row, col).length > 0) {
                        return false;
                    }
                }
            }
        }
        return true;
    }, [board, currentSide, getValidMoves]);

    const handleCellClick = useCallback(
        async (row: number, col: number) => {
            if (isPlaced.current || publicKey?.toString() !== turn?.playerWallet) return;

            if (board[row][col].includes(currentSide)) {
                setSelectedPiece({ row, col });
                setValidTargets(getValidMoves(row, col));
                return;
            }

            if (selectedPiece && isValidMove(selectedPiece.row, selectedPiece.col, row, col)) {
                isPlaced.current = true;
                const newBoard: Board = board.map((r) => [...r]);
                const { row: fromRow, col: fromCol } = selectedPiece;
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

                const moreJumps = getValidMoves(row, col).some(
                    (move) => Math.abs(move.row - row) === 2
                );

                if (hasWinner()) {
                    await endTurn(currentSide);
                } else if (isTie) {
                    await endTurn('tie');
                } else if (Math.abs(row - fromRow) === 2 && moreJumps) {
                    isPlaced.current = false;
                    setSelectedPiece({ row, col });
                    setValidTargets(getValidMoves(row, col));
                    return;
                } else {
                    await endTurn();
                }

                setSelectedPiece(null);
                setValidTargets([]);
            }
        },
        [
            board,
            currentSide,
            publicKey,
            turn,
            selectedPiece,
            isValidMove,
            getValidMoves,
            hasWinner,
            isTie,
            endTurn,
            lobby.id,
        ]
    );

    return (
        <div className='flex flex-col items-center p-4'>
            <div className='grid gap-1 bg-gray-800 p-4 rounded-lg'>
                {board.map((row, rowIndex) => (
                    <div key={rowIndex} className='flex gap-1'>
                        {row.map((cell, colIndex) => {
                            const isSelected =
                                selectedPiece?.row === rowIndex && selectedPiece?.col === colIndex;
                            const isValidTarget = validTargets.some(
                                (t) => t.row === rowIndex && t.col === colIndex
                            );

                            return (
                                <button
                                    key={colIndex}
                                    onClick={() => handleCellClick(rowIndex, colIndex)}
                                    className={`w-12 h-12 flex items-center justify-center
                                        ${
                                            (rowIndex + colIndex) % 2 === 0
                                                ? 'bg-gray-400'
                                                : 'bg-gray-600'
                                        }
                                        ${isSelected ? 'ring-4 ring-yellow-400' : ''}
                                        ${isValidTarget ? 'ring-4 ring-green-400' : ''}
                                        ${lobby.winner ? 'cursor-not-allowed' : ''}`}
                                    disabled={!!lobby.winner}
                                >
                                    <div
                                        className={`w-10 h-10 rounded-full flex items-center justify-center
                                            ${
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
                                        {(cell === 'creator' || cell === 'opponent') && (
                                            <Circle className='w-6 h-6 text-white fill-current' />
                                        )}
                                        {(cell === 'creator-king' || cell === 'opponent-king') && (
                                            <Crown className='w-6 h-6 text-yellow-400' />
                                        )}
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
}
