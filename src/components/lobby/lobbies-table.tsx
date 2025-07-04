import { Button } from '@/components/ui/button';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Wallet, Coins, Clock, Eye, History, Loader2, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import {
    formatExpirationTime,
    formatWallet,
    GameIcon,
    getLobbyDisplayStatus,
} from '@/utils/formatter';

import { GameState, getGameName, getMatchFormatName, Lobby, MatchFormat } from '@/types/games';
import { getTokenName } from '@/types/utils';

interface Props {
    lobbies: Lobby[];
    status: GameState;
}

export default function LobbiesTable({ lobbies, status }: Props) {
    if (lobbies.length === 0)
        return <p className='text-center py-8 text-muted-foreground'>No lobbys were found.</p>;

    return (
        <div className='overflow-x-auto'>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Game</TableHead>
                        <TableHead className='hidden md:table-cell'>lobbyr</TableHead>
                        <TableHead className='hidden sm:table-cell'>Format</TableHead>
                        <TableHead className='hidden sm:table-cell'>Token</TableHead>
                        <TableHead>Stake</TableHead>
                        <TableHead>Status</TableHead>
                        {status == GameState.Open && (
                            <TableHead className='hidden sm:table-cell'>Expires At</TableHead>
                        )}
                        {status == GameState.Finished && (
                            <TableHead className='hidden sm:table-cell'>Outcome</TableHead>
                        )}
                        <TableHead className='text-right'>Action</TableHead>
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
                                    <div className='flex items-center'>
                                        <GameIcon id={lobby.gameType} />
                                        <span className='font-medium truncate'>
                                            {getGameName(lobby.gameType)}
                                        </span>
                                    </div>
                                    <p className='text-xs text-muted-foreground md:hidden'>
                                        {formatWallet(lobby.creator.wallet)}
                                    </p>
                                </TableCell>
                                <TableCell className='hidden md:table-cell'>
                                    <div className='flex items-center'>
                                        <Wallet className='h-4 w-4 mr-2 text-muted-foreground shrink-0' />
                                        {formatWallet(lobby.creator.wallet)}
                                    </div>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                    <Badge
                                        variant='outline'
                                        className='text-xs sm:text-sm whitespace-nowrap'
                                    >
                                        {getMatchFormatName(lobby.format)}
                                    </Badge>
                                </TableCell>
                                <TableCell className='hidden sm:table-cell'>
                                    <Badge
                                        variant='secondary'
                                        className='text-sm whitespace-nowrap'
                                    >
                                        {getTokenName(lobby.pool.token)}
                                    </Badge>
                                </TableCell>
                                <TableCell>
                                    <div className='flex items-center whitespace-nowrap'>
                                        <Coins className='h-4 w-4 mr-1 text-yellow-500 shrink-0' />
                                        {(lobby.pool.initial / LAMPORTS_PER_SOL).toFixed(2)}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className='flex flex-col items-start'>
                                        <Badge
                                            variant={displayStatus.variant}
                                            className='text-xs sm:text-sm whitespace-nowrap'
                                        >
                                            {displayStatus.text}
                                            {lobby.state == GameState.Active &&
                                                lobby.format != MatchFormat.Single &&
                                                ` (${lobby.creator.score || 0}-${
                                                    lobby.opponent?.score || 0
                                                })`}
                                        </Badge>
                                    </div>
                                </TableCell>
                                {status == GameState.Open && (
                                    <TableCell className='hidden sm:table-cell'>
                                        <div className='flex items-center whitespace-nowrap'>
                                            <Clock className='h-4 w-4 mr-1 text-muted-foreground shrink-0' />
                                            {formatExpirationTime(lobby.expirationTime)}
                                        </div>
                                    </TableCell>
                                )}
                                {status == GameState.Finished && (
                                    <TableCell className='hidden sm:table-cell whitespace-nowrap'>
                                        {lobby.winner && lobby.format != MatchFormat.Single && (
                                            <span className='mr-1'>
                                                {lobby.winner == lobby.creator.wallet
                                                    ? `${lobby.creator.score}-${lobby.opponent?.score}`
                                                    : `${lobby.opponent?.score}-${lobby.creator.score}`}
                                            </span>
                                        )}
                                        {lobby.winner
                                            ? `Winner: ${formatWallet(lobby.winner)}`
                                            : 'Finished'}
                                    </TableCell>
                                )}
                                <TableCell className='text-right'>
                                    {/* {status == GameState.Open && (
										todo remake status showing, make queue to escape collision
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            onClick={() => handleJoinlobby(lobby)}
                                            disabled={
                                                !wallet.publicKey ||
                                                lobby.playerCount >= lobby.maxPlayers ||
                                                (wallet.publicKey &&
                                                    lobby.creatorWallet ===
                                                        wallet.publicKey.toBase58()) ||
                                                joiningGameId === lobby.id ||
                                                isFetchingBalance ||
                                                !hasSufficientXNT ||
                                                !lobby.initializeTxSig
                                            }
                                            className='whitespace-nowrap'
                                        >
                                            {joiningGameId === lobby.id ? (
                                                <>
                                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                    Staking...
                                                </>
                                            ) : isFetchingBalance && !joiningGameId ? (
                                                <>
                                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                                    Balance...
                                                </>
                                            ) : !lobby.initializeTxSig ? (
                                                <>
                                                    <ShieldAlert className='mr-2 h-4 w-4 text-destructive' />
                                                    Initializing
                                                </>
                                            ) : lobby.playerCount >= lobby.maxPlayers ? (
                                                'Full'
                                            ) : wallet.publicKey &&
                                              lobby.creatorWallet ===
                                                  wallet.publicKey.toBase58() ? (
                                                'Your Game'
                                            ) : !hasSufficientXNT ? (
                                                `Low ${lobby.token}`
                                            ) : (
                                                'Join & Stake'
                                            )}
                                        </Button>
                                    )} */}
                                    {(status == GameState.Active ||
                                        status == GameState.Finished) && (
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            asChild
                                            className='whitespace-nowrap'
                                        >
                                            <Link href={`/game/${lobby.id}`}>
                                                {status == GameState.Active ? (
                                                    <Eye className='mr-2 h-4 w-4' />
                                                ) : (
                                                    <History className='mr-2 h-4 w-4' />
                                                )}
                                                {status == GameState.Active
                                                    ? lobby.opponent
                                                        ? 'View'
                                                        : 'Wait Opponent'
                                                    : 'Details'}
                                            </Link>
                                        </Button>
                                    )}
                                </TableCell>
                            </TableRow>
                        );
                    })}
                </TableBody>
            </Table>
        </div>
    );
}
