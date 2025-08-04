"use client";

import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Wallet, Coins, Eye, History, Loader2 } from "lucide-react";
import Link from "next/link";

import useProgram from "@/hooks/use-program";
import { useWallet } from "@solana/wallet-adapter-react";
import { useCallback, useState } from "react";
import { useToast } from "@/hooks/use-toast";

import GameDatabase from "@/lib/firebase/games";

import { LAMPORTS_PER_SOL } from "@solana/web3.js";

import {
    formatWallet,
    GameIcon,
    getLobbyDisplayStatus,
} from "@/utils/formatter";

import {
    GameState,
    getGameName,
    getMatchFormatName,
    Lobby,
    MatchFormat,
    Turn,
} from "@/types/games";
import { getTokenName } from "@/types/utils";

interface Props {
    lobbies: Lobby[] | (Lobby & Turn)[];
}

export default function UserLobbies({ lobbies }: Props) {
    const { toast } = useToast();

    const { publicKey } = useWallet();
    const { closeLobby } = useProgram();

    const [isProcessing, setIsProcessing] = useState(-1);

    const handleCloseLobby = useCallback(
        async (lobbyId: number) => {
            if (!publicKey) return;
            setIsProcessing(lobbyId);

            try {
                const data = await closeLobby(lobbyId);
                if (data?.error) throw new Error(data?.error);

                await GameDatabase.deleteLobby(lobbyId);

                toast({
                    title: "Tx Submitted",
                    description: "Lobby was closed.",
                    variant: "default",
                });
            } catch (error: any) {
                await GameDatabase.dequeue(lobbyId);
                toast({
                    title: "Close Failed",
                    description:
                        error.message ??
                        "An error occurred while closing the game.",
                    variant: "destructive",
                    duration: 4000,
                });
            } finally {
                setIsProcessing(-1);
            }
        },
        [publicKey]
    );

    if (!publicKey || !lobbies.length)
        return (
            <p className="text-center py-8 text-muted-foreground">
                No games found
            </p>
        );

    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Game</TableHead>
                    <TableHead className="hidden md:table-cell">
                        Creator
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                        Format
                    </TableHead>
                    <TableHead className="hidden sm:table-cell">
                        Token
                    </TableHead>
                    <TableHead>Stake</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {lobbies.map((lobby) => {
                    const displayStatus = getLobbyDisplayStatus(lobby);
                    return (
                        <TableRow
                            key={lobby.id}
                            className={`hover:bg-muted/20 transition-colors`}
                        >
                            <TableCell>
                                <div className="flex items-center">
                                    <GameIcon id={lobby.gameType} />
                                    <span className="font-medium truncate">
                                        {getGameName(lobby.gameType)}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground md:hidden">
                                    {formatWallet(lobby.creator.wallet)}
                                </p>
                            </TableCell>
                            <TableCell className="hidden md:table-cell">
                                <div className="flex items-center">
                                    <Wallet className="h-4 w-4 mr-2 text-muted-foreground shrink-0" />
                                    {formatWallet(lobby.creator.wallet)}
                                </div>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge
                                    variant="outline"
                                    className="text-xs sm:text-sm whitespace-nowrap"
                                >
                                    {getMatchFormatName(lobby.format)}
                                </Badge>
                            </TableCell>
                            <TableCell className="hidden sm:table-cell">
                                <Badge
                                    variant="secondary"
                                    className="text-sm whitespace-nowrap"
                                >
                                    {getTokenName(lobby.pool.token)}
                                </Badge>
                            </TableCell>
                            <TableCell>
                                <div className="flex items-center whitespace-nowrap">
                                    <Coins className="h-4 w-4 mr-1 text-yellow-500 shrink-0" />
                                    {(
                                        lobby.pool.initial / LAMPORTS_PER_SOL
                                    ).toFixed(2)}
                                </div>
                            </TableCell>
                            <TableCell>
                                <div className="flex flex-col items-start">
                                    <Badge
                                        variant={displayStatus.variant}
                                        className="text-xs sm:text-sm whitespace-nowrap"
                                    >
                                        {displayStatus.text}
                                        {lobby.state == GameState.Active &&
                                            lobby.format !=
                                                MatchFormat.Single &&
                                            ` (${lobby.creator.score || 0}-${
                                                lobby.opponent?.score || 0
                                            })`}
                                    </Badge>
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                {lobby.state == GameState.Open && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() =>
                                            handleCloseLobby(lobby.id)
                                        }
                                        disabled={
                                            !!lobby.opponent ||
                                            !publicKey ||
                                            (lobby.expirationTime !=
                                                undefined &&
                                                lobby.expirationTime <=
                                                    Date.now() &&
                                                publicKey.toString() !=
                                                    lobby.creator.wallet)
                                        }
                                        className="whitespace-nowrap"
                                    >
                                        {publicKey?.toString() ==
                                            lobby.creator.wallet &&
                                        isProcessing == lobby.id ? (
                                            <>
                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                Cancelling...
                                            </>
                                        ) : publicKey?.toString() ==
                                          lobby.creator.wallet ? (
                                            "Cancel Challenge"
                                        ) : lobby.expirationTime &&
                                          lobby.expirationTime <= Date.now() ? (
                                            "Expired"
                                        ) : (
                                            "Full"
                                        )}
                                    </Button>
                                )}
                                {lobby.state == GameState.Active && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="whitespace-nowrap"
                                    >
                                        <Link href={`/game/${lobby.id}`}>
                                            <Eye className="mr-2 h-4 w-4" />
                                            {!lobby.opponent
                                                ? "Wait Opponent"
                                                : (lobby as any).playerWallet
                                                ? "Preparing"
                                                : publicKey?.toString() ==
                                                  (lobby as any).playerWallet
                                                ? "Your Turn"
                                                : "Opponent's Turn"}
                                        </Link>
                                    </Button>
                                )}
                                {lobby.state == GameState.Finished && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        asChild
                                        className="whitespace-nowrap"
                                    >
                                        <Link href={`/game/${lobby.id}`}>
                                            <History className="mr-2 h-4 w-4" />
                                            {lobby.winner
                                                ? "Tie"
                                                : lobby.winner ==
                                                  publicKey.toString()
                                                ? "You Won"
                                                : "You Lose"}
                                        </Link>
                                    </Button>
                                )}
                            </TableCell>
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}
