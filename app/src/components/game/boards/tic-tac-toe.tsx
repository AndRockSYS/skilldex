"use client";

import Image from "next/image";

import { useCallback, useEffect, useMemo, useRef } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { useQuery } from "@tanstack/react-query";

import GameDatabase from "@/lib/firebase/games";

import { GAME_SETTINGS } from "@/utils/constants";

import { Lobby, Turn } from "@/types/games";

type Player = "creator" | "opponent" | "none";
type Board = Player[][];

interface Props {
    lobby: Lobby;
    turn: Turn | undefined;
    isSpectator: boolean;
    endTurn: (winnerSide?: "creator" | "opponent" | "tie") => Promise<void>;
}

export default function TicTacToe({
    lobby,
    isSpectator,
    turn,
    endTurn,
}: Props) {
    const { data: board, isSuccess } = useQuery({
        queryKey: ["gameData", "ticTacToe", lobby.id],
        queryFn: async () => await GameDatabase.fetchGameData<Board>(lobby.id),
        initialData: GAME_SETTINGS.ticTacToe.initialBoard,
        refetchInterval: 1_000,
    });

    const { publicKey } = useWallet();
    const currentSide = useMemo(
        () =>
            lobby.creator.wallet == turn?.playerWallet ? "creator" : "opponent",
        [lobby, turn]
    );

    const isPlaced = useRef(false);
    useEffect(() => {
        if (publicKey?.toString() == turn?.playerWallet)
            isPlaced.current = false;
    }, [publicKey, turn]);

    const hasWinner = useCallback(
        (board: Board) => {
            for (let row = 0; row < 3; row++) {
                if (
                    board[row][0] == currentSide &&
                    board[row][1] == currentSide &&
                    board[row][2] == currentSide
                )
                    return true;
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
        },
        [currentSide]
    );

    const handleCellClick = useCallback(
        async (row: number, col: number) => {
            if (
                isPlaced.current ||
                publicKey?.toString() != turn?.playerWallet ||
                board[row][col] != "none"
            )
                return;
            isPlaced.current = true;

            const newBoard: Board = board.map((r) => [...r]);
            newBoard[row][col] = currentSide;
            const isTie = newBoard.every((row) =>
                row.every((cell) => cell != "none")
            );

            await GameDatabase.uploadGameData(lobby.id, newBoard);

            if (hasWinner(newBoard)) await endTurn(currentSide);
            else if (isTie) await endTurn("tie");
            else await endTurn();
        },
        [board, publicKey, turn, currentSide]
    );

    return (
        <div className="flex flex-col items-center p-4">
            <div className="bg-gradient-to-br from-[#2cdbfd] to-[#ee3dfc] rounded-lg p-1">
                <div className="grid gap-2 bg-[#000815] p-4 rounded-lg">
                    {board.map((row, rowIndex) => (
                        <div key={rowIndex} className="flex gap-2">
                            {row.map((cell, colIndex) => (
                                <button
                                    key={colIndex}
                                    onClick={() =>
                                        handleCellClick(rowIndex, colIndex)
                                    }
                                    className="w-16 h-16 bg-[#081d35] border border-[#2cdbfd] flex items-center justify-center rounded-md"
                                    disabled={isSpectator || !isSuccess}
                                >
                                    {cell != "none" && (
                                        <Image
                                            className="p-2"
                                            src={`/images/games/tic-tac-toe/${cell}.png`}
                                            alt={cell}
                                            width={150}
                                            height={150}
                                        />
                                    )}
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
