'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
    CardFooter,
} from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Swords, Coins, Clock, AlertTriangle, Eye, Info, Trophy, Flag } from 'lucide-react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import PlayerCard from '@/components/game/player-card';
import ConnectFour from '@/components/game/connect-four/board';
import TicTacToe from '@/components/game/tic-tac-toe/board';

import { useParams } from 'next/navigation';
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import useGameProcessing from '@/hooks/game/use-game-processing';

import GameDatabase from '@/lib/firebase/games';
import AppDatabase from '@/lib/firebase/client';

import { gameEmojis } from '@/content/emojis';
import { PLATFORM_COMMISSION } from '@/utils/constants';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { convertTurnTimeLeft, formatWallet } from '@/utils/formatter';

import {
    GameState,
    GameType,
    getGameName,
    getMatchFormatName,
    getStateName,
    MatchFormat,
} from '@/types/games';
import { getTokenName } from '@/types/utils';
import { Player } from '@/types/user';

export default function GameRoomPage() {
    const { gameId } = useParams();

    const { toast } = useToast();

    const { publicKey } = useWallet();

    const { isSpectator, gameData, turn, endTurn, emojis, soundRef, turnTimeLeft } =
        useGameProcessing(Number(gameId));

    const [reportReason, setReportReason] = useState('');
    const [isReporting, setIsReporting] = useState(false);

    const sendReaction = useCallback(
        async (emoji: string) => {
            if (!gameData || !publicKey || gameData.state != GameState.Active) {
                toast({
                    title: 'Reaction Failed',
                    description: 'Cannot send reaction. Conditions not met.',
                    variant: 'default',
                });
                return;
            }

            await GameDatabase.addEmoji(gameData.id, publicKey.toString(), emoji);

            toast({ title: 'Reaction Sent!', description: `You sent a ${emoji} emoji.` });
        },
        [gameData, publicKey]
    );

    const handleReportSubmit = useCallback(async () => {
        if (!gameData || !reportReason.trim()) {
            toast({
                title: 'Report Error',
                description: 'Please provide a reason for your report.',
                variant: 'destructive',
            });
            return;
        }
        setIsReporting(true);

        try {
            await AppDatabase.createGameReport(gameData.id, reportReason, publicKey?.toString());
            toast({
                title: 'Report Submitted',
                description: 'Thank you, your report has been submitted for review.',
            });
        } catch (error: any) {
            toast({
                title: 'Report Error',
                description: 'Could not submit report.',
                variant: 'destructive',
            });
        } finally {
            setIsReporting(false);
        }
    }, [gameData, reportReason, publicKey]);

    if (!gameData) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <p>Loading game...</p>
            </div>
        );
    }

    return (
        <div className='space-y-6 md:space-y-8 relative'>
            <audio src='/sounds/turn.mp3' ref={soundRef}></audio>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                <div className='text-center md:text-left'>
                    <h1 className='font-headline text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight flex items-center justify-center md:justify-start'>
                        <Swords className='h-7 w-7 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-primary' />
                        {getGameName(gameData.gameType)}
                        <span className='text-muted-foreground text-xl sm:text-2xl ml-2'>
                            (ID: {gameId})
                        </span>
                        {isSpectator && gameData.state == GameState.Active && (
                            <Badge variant='secondary' className='ml-3 text-sm flex items-center'>
                                <Eye className='mr-1.5 h-4 w-4' />
                                Spectating
                            </Badge>
                        )}
                    </h1>
                    {gameData.format != MatchFormat.Single &&
                        gameData.state == GameState.Active &&
                        gameData.opponent && (
                            <p className='text-primary font-semibold text-base sm:text-lg mt-1'>
                                {getMatchFormatName(gameData.format)} - Score:{' '}
                                {gameData.creator.score}{' '}
                                {gameData.creator.name ?? formatWallet(gameData.creator.wallet)} vs{' '}
                                {gameData.opponent.name ?? formatWallet(gameData.opponent.wallet)}{' '}
                                {gameData.opponent.score}
                            </p>
                        )}
                </div>
                <Link href='/lobby'>
                    <Button variant='outline' className='w-full md:w-auto'>
                        Back to Lobby
                    </Button>
                </Link>
            </div>

            <div className='grid md:grid-cols-3 gap-4 md:gap-6 items-start'>
                <PlayerCard
                    player={gameData.creator}
                    isActive={turn?.playerWallet == gameData.creator.wallet}
                    turnWallet={turn?.playerWallet ?? ''}
                    reaction={emojis.find((reaction) => reaction.sender == gameData.creator.wallet)}
                />

                <Card className='md:col-span-1 flex flex-col items-center justify-center p-4 sm:p-6 bg-card shadow-inner'>
                    <div className='flex items-center justify-between w-full mb-4'>
                        <CardTitle className='font-headline text-xl sm:text-2xl text-center'>
                            Game Board
                        </CardTitle>
                        <Button variant='ghost' size='icon' asChild>
                            <Link
                                href='/how-it-works#game-rules-overview'
                                target='_blank'
                                rel='noopener noreferrer'
                                title='Game Rules'
                            >
                                <Info className='h-5 w-5 text-muted-foreground hover:text-primary' />
                                <span className='sr-only'>Game Rules</span>
                            </Link>
                        </Button>
                    </div>
                    {gameData.state == GameState.Finished ? (
                        <></>
                    ) : gameData.gameType == GameType.ConnectFour ? (
                        <ConnectFour lobby={gameData} turn={turn} endTurn={endTurn} />
                    ) : gameData.gameType == GameType.TicTacToe ? (
                        <TicTacToe lobby={gameData} turn={turn} endTurn={endTurn} />
                    ) : (
                        <></>
                    )}
                    <p className='text-sm text-muted-foreground text-center'>
                        {gameData.state == GameState.Active
                            ? `${turn?.playerWallet}'s turn.`
                            : gameData.state == GameState.Open
                            ? 'Waiting for opponent...'
                            : gameData.winner &&
                              `Game Finished. Winner: ${formatWallet(gameData.winner)}`}
                    </p>
                    {gameData.state == GameState.Open && (
                        <p className='text-lg font-semibold text-primary mt-2'>
                            Waiting for opponent to join & stake...
                        </p>
                    )}
                    {turn?.turnStart && (
                        <p className='text-xs text-muted-foreground mt-2'>
                            Turn started: {new Date(turn?.turnStart).toLocaleTimeString()}
                        </p>
                    )}
                </Card>

                {gameData.opponent && (
                    <PlayerCard
                        player={gameData.opponent as any}
                        isActive={turn?.playerWallet == gameData.opponent.wallet}
                        turnWallet={turn?.playerWallet ?? ''}
                        reaction={emojis.find(
                            (reaction) => reaction.sender == (gameData.opponent as Player).wallet
                        )}
                    />
                )}

                {gameData.state == GameState.Open && (
                    <Card className='opacity-70'>
                        <CardHeader className='flex flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4'>
                            <Avatar className='h-12 w-12 sm:h-16 sm:w-16 border-2 border-muted-foreground'>
                                <AvatarImage
                                    src='https://placehold.co/64x64.png'
                                    alt='Waiting for player'
                                    data-ai-hint='player avatar'
                                />
                                <AvatarFallback>?</AvatarFallback>
                            </Avatar>
                            <div>
                                <CardTitle className='font-headline text-lg sm:text-xl'>
                                    Waiting for Opponent
                                </CardTitle>
                                <Badge variant='secondary' className='mt-1 text-xs sm:text-sm'>
                                    Player 2
                                </Badge>
                            </div>
                        </CardHeader>
                    </Card>
                )}
            </div>

            {!isSpectator && gameData.state == GameState.Active && (
                <Card className='mt-6'>
                    <CardHeader className='p-3 sm:p-4 !pb-2'>
                        <CardTitle className='text-center font-headline text-lg sm:text-xl'>
                            Send Reaction
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='p-3 sm:p-4 flex flex-wrap justify-center items-center gap-2'>
                        {gameEmojis.map((emoji) => (
                            <Button
                                key={emoji}
                                variant='outline'
                                size='icon'
                                className='text-xl sm:text-2xl w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-primary/10 focus:ring-accent'
                                onClick={() => sendReaction(emoji)}
                                disabled={
                                    isSpectator || !gameData || gameData.state != GameState.Active
                                }
                                title={`Send ${emoji} reaction`}
                            >
                                {emoji}
                            </Button>
                        ))}
                    </CardContent>
                </Card>
            )}

            <Card>
                <CardHeader>
                    <CardTitle className='font-headline text-xl sm:text-2xl'>
                        Match Information
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <div className='grid grid-cols-2 lg:grid-cols-4 gap-4 text-center'>
                        <div>
                            <p className='text-xs sm:text-sm text-muted-foreground'>Match Format</p>
                            <p className='font-semibold text-base sm:text-lg flex items-center justify-center'>
                                <Trophy className='h-4 w-4 sm:h-5 sm:w-5 mr-1 text-muted-foreground' />{' '}
                                {getMatchFormatName(gameData.format)}
                            </p>
                        </div>
                        <div>
                            <p className='text-xs sm:text-sm text-muted-foreground'>
                                Stake (per player)
                            </p>
                            <p className='font-semibold text-base sm:text-lg flex items-center justify-center'>
                                <Coins className='h-4 w-4 sm:h-5 sm:w-5 mr-1 text-yellow-500' />{' '}
                                {(gameData.pool.initial / LAMPORTS_PER_SOL).toFixed(2)}{' '}
                                {getTokenName(gameData.pool.token)}
                            </p>
                        </div>
                        <div>
                            <p className='text-xs sm:text-sm text-muted-foreground'>
                                Net Prize for Winner
                            </p>
                            <p className='font-semibold text-base sm:text-lg text-primary flex items-center justify-center'>
                                <Coins className='h-4 w-4 sm:h-5 sm:w-5 mr-1 text-primary' />{' '}
                                {(
                                    ((gameData.pool.initial * 2) / LAMPORTS_PER_SOL / 100) *
                                    (100 - PLATFORM_COMMISSION)
                                ).toFixed(4)}{' '}
                                {getTokenName(gameData.pool.token)}
                            </p>
                        </div>
                        <div>
                            <p className='text-xs sm:text-sm text-muted-foreground'>Status</p>
                            <p className='font-semibold text-base sm:text-lg flex items-center justify-center'>
                                <Badge
                                    variant={
                                        gameData.state == GameState.Active
                                            ? 'default'
                                            : gameData.state == GameState.Open
                                            ? 'secondary'
                                            : 'destructive'
                                    }
                                    className='text-xs sm:text-sm capitalize'
                                >
                                    {getStateName(gameData.state)}
                                </Badge>
                            </p>
                        </div>
                    </div>
                    <Separator />
                    <CardDescription className='text-xs text-muted-foreground text-center'>
                        Platform fee: {PLATFORM_COMMISSION}% of total stake. Solana network fees
                        also apply to transactions.
                    </CardDescription>
                    {gameData.state == GameState.Active && (
                        <div>
                            <div className='flex justify-between items-center mb-2'>
                                <p className='text-sm font-medium flex items-center'>
                                    <Clock className='h-5 w-5 mr-2 text-primary' /> Time Left for
                                    Game Turn:
                                </p>
                                <Badge
                                    variant={
                                        turnTimeLeft < gameData.timeLimit * 0.1
                                            ? 'destructive'
                                            : 'default'
                                    }
                                    className='text-base sm:text-lg px-3 py-1'
                                >
                                    {convertTurnTimeLeft(turnTimeLeft)}
                                </Badge>
                            </div>
                            <Progress
                                value={(turnTimeLeft / gameData.timeLimit) * 100}
                                className='h-2 sm:h-3'
                            />
                            <CardDescription className='text-xs text-muted-foreground mt-2 flex items-center'>
                                <AlertTriangle className='h-4 w-4 mr-1 text-destructive' />{' '}
                                {turn?.playerWallet == publicKey?.toString()
                                    ? `If the timer reaches zero, your opponent wins this game by default.`
                                    : `If the timer reaches zero, you win this game by default`}
                            </CardDescription>
                            {turnTimeLeft == 0 &&
                                !isSpectator &&
                                publicKey &&
                                turn?.playerWallet == publicKey.toString() && (
                                    <p className='text-xs text-destructive mt-1'>Processing...</p>
                                )}
                        </div>
                    )}
                </CardContent>
                {!isSpectator && gameData.state == GameState.Active && (
                    <CardFooter>
                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Button
                                    variant='outline'
                                    size='sm'
                                    className='w-full sm:w-auto text-destructive border-destructive hover:bg-destructive/10 hover:text-destructive'
                                >
                                    <Flag className='mr-2 h-4 w-4' /> Report Game
                                </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Report Suspicious Activity</AlertDialogTitle>
                                    <AlertDialogDescription>
                                        If you suspect cheating or other unfair play, please
                                        describe the issue below. Your report will be reviewed by an
                                        admin.
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <div className='space-y-2'>
                                    <Label htmlFor='reportReason'>Reason for reporting:</Label>
                                    <Textarea
                                        id='reportReason'
                                        placeholder='Describe the suspicious activity...'
                                        value={reportReason}
                                        onChange={(e) => setReportReason(e.target.value)}
                                    />
                                </div>
                                <AlertDialogFooter>
                                    <AlertDialogCancel onClick={() => setReportReason('')}>
                                        Cancel
                                    </AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={handleReportSubmit}
                                        disabled={isReporting || !reportReason.trim()}
                                    >
                                        {isReporting ? 'Submitting...' : 'Submit Report'}
                                    </AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>
                    </CardFooter>
                )}
            </Card>
        </div>
    );
}
