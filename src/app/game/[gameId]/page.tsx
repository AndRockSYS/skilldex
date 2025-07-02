'use client';

// todo refactor after adding games

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
import { Swords, Coins, Clock, Bot, AlertTriangle, Eye, Info, Trophy, Flag } from 'lucide-react';
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

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';

import { reportGameActivity } from '@/actions/game';

import { cn } from '@/lib/utils';

import { Timestamp } from 'firebase/firestore';
import { ActivePlayer } from '@/types/user';
import { getGameName, Lobby } from '@/types/games';

import { formatWallet } from '@/utils/formatter';

export default function GameRoomPage() {
    const { gameId } = useParams();
    const { toast } = useToast();
    const router = useRouter();

    const { publicKey } = useWallet();

    const [players, setPlayers] = useState<ActivePlayer[]>([]);
    const [timeLeft, setTimeLeft] = useState<number | null>(null);
    const [isAITurn, setIsAITurn] = useState(false);

    const [originalTitle, setOriginalTitle] = useState('');
    const [notificationPermission, setNotificationPermission] = useState<
        NotificationPermission | 'not_supported'
    >('default');
    const [isTabVisible, setIsTabVisible] = useState(true);
    const notificationSoundRef = useRef<HTMLAudioElement | null>(null);

    const [player1DisplayedReaction, setPlayer1DisplayedReaction] = useState<string | null>(null);
    const [player2DisplayedReaction, setPlayer2DisplayedReaction] = useState<string | null>(null);
    const [lastP1ReactionTs, setLastP1ReactionTs] = useState<number | null>(null);
    const [lastP2ReactionTs, setLastP2ReactionTs] = useState<number | null>(null);
    const [reportReason, setReportReason] = useState('');
    const [isReporting, setIsReporting] = useState(false);

    const { data: gameData } = useQuery({
        queryKey: ['game', gameId],
        queryFn: async () => {
            // todo fetch the game by its id
            return {} as Lobby;
        },
        throwOnError: (error) => {
            toast({
                title: 'Error',
                description: 'Game not found in demo data.',
                variant: 'destructive',
            });
            router.push('/lobby');
            throw error;
        },
    });

    const isSpectator = useMemo(() => {
        if (!publicKey || !gameData) return true;
        if (
            gameData.creator.wallet == publicKey.toString() ||
            gameData.opponent?.wallet == publicKey.toString()
        )
            return false;

        return true;
    }, [gameData, publicKey]);

    useEffect(() => {
        if (gameData && gameData.winner) {
            if (
                !publicKey ||
                gameData.creator.wallet != publicKey.toString() ||
                gameData.opponent.wallet != publicKey.toString()
            ) {
                toast({
                    title: 'Game Over',
                    description: `${getGameName(gameData.gameType)} has concluded. Winner: ${
                        gameData.winner ? formatWallet(gameData.winner) : 'N/A'
                    }`,
                    variant: 'default',
                });
                router.push('/lobby');
            } else router.push(`/game/${gameId}/result`);
        }
    }, [gameData, publicKey]);

    useEffect(() => {
        if (!gameData) return;

        const p1Wallet = gameData.creatorWallet;
        const p1IsCurrentUser = publicKey ? p1Wallet === publicKey.toBase58() : false;
        const p1: Player = {
            id: p1Wallet,
            name: p1IsCurrentUser && !isSpectator ? 'You' : `Player ${p1Wallet.substring(0, 4)}`,
            avatarUrl: `https://placehold.co/128x128.png`,
            isCurrentUser: p1IsCurrentUser && !isSpectator,
            status: gameData.currentPlayerId === p1Wallet ? 'Thinking...' : 'Online',
            score: gameData.player1Score || 0,
        };

        let p2: Player | null = null;
        if (gameData.opponentWallet) {
            const p2Wallet = gameData.opponentWallet;
            const p2IsCurrentUser = publicKey ? p2Wallet === publicKey.toBase58() : false;
            p2 = {
                id: p2Wallet,
                name:
                    p2IsCurrentUser && !isSpectator ? 'You' : `Player ${p2Wallet.substring(0, 4)}`,
                avatarUrl: `https://placehold.co/128x128.png`,
                isCurrentUser: p2IsCurrentUser && !isSpectator,
                status: gameData.currentPlayerId === p2Wallet ? 'Thinking...' : 'Online',
                score: gameData.player2Score || 0,
            };
        } else if (gameData.status === 'open') {
            p2 = {
                id: 'player2_waiting',
                name: 'Waiting...',
                avatarUrl: 'https://placehold.co/128x128.png',
                isCurrentUser: false,
                status: 'Waiting...',
                score: 0,
            };
        }

        setPlayers(p2 ? [p1, p2] : [p1]);

        if (
            gameData.turnTimeLimit &&
            gameData.turnStartTimestamp &&
            gameData.status === 'in_play'
        ) {
            const turnEndTime =
                gameData.turn.turnStartTimestamp.toDate().getTime() + gameData.turnTimeLimit * 1000;
            const newTimeLeft = Math.max(0, Math.floor((turnEndTime - Date.now()) / 1000));
            setTimeLeft(newTimeLeft);
        } else if (gameData.turnTimeLimit) {
            setTimeLeft(gameData.turnTimeLimit);
        } else {
            setTimeLeft(60);
        }

        if (gameData.player1LastEmoji) {
            const newTs = gameData.player1LastEmoji.timestamp.toMillis();
            if (!lastP1ReactionTs || newTs > lastP1ReactionTs) {
                setPlayer1DisplayedReaction(gameData.player1LastEmoji.emoji);
                setLastP1ReactionTs(newTs);
                setTimeout(() => setPlayer1DisplayedReaction(null), 3000);
            }
        }

        if (gameData.player2LastEmoji && gameData.opponentWallet) {
            const newTs = gameData.player2LastEmoji.timestamp.toMillis();
            if (!lastP2ReactionTs || newTs > lastP2ReactionTs) {
                setPlayer2DisplayedReaction(gameData.player2LastEmoji.emoji);
                setLastP2ReactionTs(newTs);
                setTimeout(() => setPlayer2DisplayedReaction(null), 3000);
            }
        }
    }, [gameData, publicKey, lastP1ReactionTs, lastP2ReactionTs]);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setOriginalTitle(document.title);
            setIsTabVisible(!document.hidden);

            if (!('Notification' in window)) {
                setNotificationPermission('not_supported');
            } else {
                setNotificationPermission(Notification.permission);
            }

            const handleVisibilityChange = () => setIsTabVisible(!document.hidden);
            document.addEventListener('visibilitychange', handleVisibilityChange);

            if (!notificationSoundRef.current) {
                notificationSoundRef.current = new Audio('/sounds/notification-alert.mp3');
                notificationSoundRef.current.load();
            }

            return () => {
                document.removeEventListener('visibilitychange', handleVisibilityChange);
                if (notificationSoundRef.current) {
                    notificationSoundRef.current.pause();
                    notificationSoundRef.current = null;
                }
            };
        }
    }, []);

    useEffect(() => {
        if (
            notificationPermission === 'default' &&
            typeof window !== 'undefined' &&
            'Notification' in window &&
            Notification.requestPermission
        ) {
            Notification.requestPermission().then((permission) => {
                setNotificationPermission(permission);
                if (permission === 'denied') {
                    toast({
                        title: 'Notifications Blocked',
                        description: "You won't receive browser notifications for your turn.",
                        variant: 'default',
                        duration: 7000,
                    });
                } else if (permission === 'granted') {
                    toast({
                        title: 'Notifications Enabled',
                        description: "You'll get a pop-up for your turn if the tab is inactive.",
                        variant: 'default',
                        duration: 5000,
                    });
                }
            });
        }
    }, [notificationPermission, toast]);

    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !originalTitle ||
            !gameData ||
            !publicKey ||
            isSpectator
        )
            return;

        const isMyTurn = gameData.currentPlayerId === publicKey.toBase58();
        const me = players.find((p) => p.id === publicKey.toBase58());

        const isEffectivelyOffline = !isTabVisible;
        const appName = 'SKILLDEX.IO';
        let soundPlayedForThisNotification = false;

        const playTurnSound = () => {
            if (
                notificationSoundRef.current &&
                notificationSoundRef.current.readyState >= 2 &&
                !soundPlayedForThisNotification
            ) {
                notificationSoundRef.current
                    .play()
                    .catch((e) =>
                        console.warn(
                            'Notification sound play failed. User interaction might be needed first.',
                            e
                        )
                    );
                soundPlayedForThisNotification = true;
            } else if (
                notificationSoundRef.current &&
                notificationSoundRef.current.readyState < 2
            ) {
                console.warn('Notification sound not ready to play.');
            }
        };

        if (isMyTurn && me) {
            if (isEffectivelyOffline) {
                if (document.title !== `❗ Your Turn! - ${appName}`) {
                    document.title = `❗ Your Turn! - ${appName}`;
                    playTurnSound();
                }
                if (notificationPermission === 'granted') {
                    const notification = new Notification(`It's your turn, ${me.name}!`, {
                        body: `Time to make your move in ${gameData.gameName} on ${appName}.`,
                        icon: '/logo_icon_placeholder_192.png',
                        tag: `skilldex-io-turn-${gameId}`,
                        renotify: true,
                    });
                    notification.onclick = () => {
                        window.focus();
                        router.push(`/game/${gameId}`);
                        notification.close();
                    };
                }
                console.log(
                    `NOTIFICATION_LOG: User ${
                        me.id
                    } (wallet: ${publicKey.toBase58()}) is effectively offline for game ${gameId}. Backend should verify offline status and consider triggering an email notification (lookup email from user profile for ${
                        me.id
                    }).`
                );
            } else {
                if (document.title !== `❗ Your Turn! - ${appName}`) {
                    document.title = `❗ Your Turn! - ${appName}`;
                    if (typeof document.hasFocus === 'function' && !document.hasFocus()) {
                        playTurnSound();
                    }
                }
            }
        } else {
            if (document.title !== originalTitle) {
                document.title = originalTitle;
            }
        }
    }, [
        gameData,
        players,
        notificationPermission,
        originalTitle,
        gameId,
        isTabVisible,
        publicKey,
        router,
        toast,
        isSpectator,
    ]);

    const checkSeriesEnd = useCallback(
        (p1Score: number, p2Score: number, matchFormat: MatchFormat): string | null => {
            if (!gameData) return null;
            const targetScore =
                matchFormat === 'best_of_3' ? 2 : matchFormat === 'best_of_5' ? 3 : 1;
            if (p1Score >= targetScore) return gameData.creatorWallet;
            if (p2Score >= targetScore) return gameData.opponentWallet || null;
            return null;
        },
        [gameData]
    );

    const handleEndSingleGame = useCallback(
        async (singleGameWinnerId: string | null) => {
            if (!gameData || !publicKey || isSpectator || !singleGameWinnerId) return;

            let newPlayer1Score = gameData.player1Score || 0;
            let newPlayer2Score = gameData.player2Score || 0;
            const matchFormat = gameData.matchFormat || 'single';

            if (singleGameWinnerId === gameData.creatorWallet) {
                newPlayer1Score++;
            } else if (singleGameWinnerId === gameData.opponentWallet) {
                newPlayer2Score++;
            }

            const seriesWinnerId = checkSeriesEnd(newPlayer1Score, newPlayer2Score, matchFormat);

            if (seriesWinnerId) {
                console.log(
                    `(Demo Mode) GAME ENDED: Challenge ${gameId} winner is ${seriesWinnerId}.`
                );
                toast({
                    title: 'Match Over!',
                    description: `Player ${seriesWinnerId.substring(0, 6)}... wins the series!`,
                    variant: 'default',
                    duration: 10000,
                });

                await updateUserStats(seriesWinnerId, {
                    pointsIncrement: 10,
                    challengesWonIncrement: 1,
                });

                // In demo mode, we just navigate to the win/loss page
                if (seriesWinnerId === publicKey.toBase58()) {
                    router.push(`/game/${gameId}/win`);
                } else {
                    router.push(`/game/${gameId}/lose`);
                }
            } else {
                // Series continues, update scores and prepare for next game
                const nextPlayerId =
                    gameData.currentPlayerId === gameData.creatorWallet
                        ? gameData.opponentWallet
                        : gameData.creatorWallet;

                const updatedGameData = {
                    ...gameData,
                    player1Score: newPlayer1Score,
                    player2Score: newPlayer2Score,
                    currentPlayerId: nextPlayerId,
                    turnStartTimestamp: Timestamp.now(),
                };
                setGameData(updatedGameData as GameDataFromFirestore); // Update local state for demo
                toast({
                    title: 'Game Won!',
                    description: `Player ${singleGameWinnerId.substring(
                        0,
                        6
                    )}... takes this game. Next game starting...`,
                    variant: 'default',
                });
            }
        },
        [gameData, gameId, publicKey, isSpectator, toast, checkSeriesEnd, router]
    );

    const handleTurnEnd = useCallback(async () => {
        if (!gameData || !publicKey || !players.length || isSpectator) return;

        const currentPlayerTimedOut = players.find((p) => p.id === gameData.currentPlayerId);
        if (!currentPlayerTimedOut) return;

        const singleGameWinnerId =
            gameData.currentPlayerId === gameData.creatorWallet
                ? gameData.opponentWallet
                : gameData.creatorWallet;

        if (!singleGameWinnerId) {
            console.error('Could not determine winner upon turn timeout.');
            toast({
                title: 'Game Logic Error',
                description: 'Could not determine winner from timeout.',
                variant: 'destructive',
            });
            return;
        }

        toast({
            title: 'Turn Timed Out!',
            description: `${currentPlayerTimedOut.name} ran out of time. ${
                players.find((p) => p.id === singleGameWinnerId)?.name || 'Opponent'
            } wins this game.`,
            variant: 'destructive',
            duration: 7000,
        });

        await handleEndSingleGame(singleGameWinnerId);
        setIsAITurn(false);
    }, [players, gameData, toast, publicKey, isSpectator, handleEndSingleGame]);

    useEffect(() => {
        if (isSpectator || timeLeft === null || timeLeft <= 0 || gameData?.status !== 'in_play') {
            if (
                timeLeft === 0 &&
                gameData?.status === 'in_play' &&
                !isSpectator &&
                publicKey &&
                gameData.currentPlayerId === publicKey.toBase58()
            ) {
                handleTurnEnd();
            }
            return;
        }
        const timer = setInterval(() => {
            setTimeLeft((prevTime) => (prevTime !== null && prevTime > 0 ? prevTime - 1 : 0));
        }, 1000);
        return () => clearInterval(timer);
    }, [timeLeft, handleTurnEnd, gameData, isSpectator, publicKey]);

    const simulateEndSingleGame = useCallback(
        async (didWinThisGame: boolean) => {
            if (!gameData || !publicKey || isSpectator) {
                toast({
                    title: 'Action Blocked',
                    description:
                        'Cannot simulate game end. Conditions not met (e.g. not logged in, spectator, or game data missing).',
                    variant: 'destructive',
                });
                return;
            }

            const singleGameWinnerId = didWinThisGame
                ? publicKey.toBase58()
                : players.find((p) => p.id !== publicKey.toBase58())?.id || null;

            if (!singleGameWinnerId) {
                toast({
                    title: 'Simulation Error',
                    description:
                        'Cannot determine game winner for simulation. Opponent might be missing or you are the only player.',
                    variant: 'destructive',
                });
                return;
            }
            await handleEndSingleGame(singleGameWinnerId);
        },
        [gameData, publicKey, isSpectator, handleEndSingleGame, toast, players]
    );

    const sendReaction = useCallback(
        async (emoji: string) => {
            if (!gameData || !publicKey || isSpectator || gameData.status !== 'in_play') {
                toast({
                    title: 'Reaction Failed',
                    description: 'Cannot send reaction. Conditions not met.',
                    variant: 'default',
                });
                return;
            }

            const myWallet = publicKey.toBase58();
            let updatedGameData = { ...gameData };

            if (myWallet === gameData.creatorWallet) {
                updatedGameData.player1LastEmoji = { emoji, timestamp: Timestamp.now() };
            } else if (gameData.opponentWallet && myWallet === gameData.opponentWallet) {
                updatedGameData.player2LastEmoji = { emoji, timestamp: Timestamp.now() };
            } else {
                return;
            }

            setGameData(updatedGameData as GameDataFromFirestore);
            toast({ title: 'Reaction Sent!', description: `You sent a ${emoji} emoji.` });
        },
        [gameData, publicKey, isSpectator, toast]
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
            const result = await reportGameActivity({
                gameId: gameData.id,
                reporterWallet: publicKey ? publicKey.toBase58() : undefined,
                reason: reportReason,
            });
            if (result.success) {
                toast({
                    title: 'Report Submitted',
                    description: 'Thank you, your report has been submitted for review.',
                });
                setReportReason('');
            } else {
                toast({
                    title: 'Report Failed',
                    description: result.message,
                    variant: 'destructive',
                });
            }
        } catch (error: any) {
            toast({
                title: 'Report Error',
                description: error.message || 'Could not submit report.',
                variant: 'destructive',
            });
        } finally {
            setIsReporting(false);
        }
    }, [gameData, reportReason, publicKey, toast, gameId]);

    if (!gameData || !players.length) {
        return (
            <div className='flex justify-center items-center h-screen'>
                <p>Loading game...</p>
            </div>
        );
    }

    return (
        <div className='space-y-6 md:space-y-8 relative'>
            <div className='flex flex-col md:flex-row justify-between items-center gap-4'>
                <div className='text-center md:text-left'>
                    <h1 className='font-headline text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight flex items-center justify-center md:justify-start'>
                        <Swords className='h-7 w-7 sm:h-8 sm:w-8 mr-2 sm:mr-3 text-primary' />
                        {gameData.gameName}
                        <span className='text-muted-foreground text-xl sm:text-2xl ml-2'>
                            (ID: {gameId.substring(0, 6)}...)
                        </span>
                        {isSpectator && gameData.status === 'in_play' && (
                            <Badge variant='secondary' className='ml-3 text-sm flex items-center'>
                                <Eye className='mr-1.5 h-4 w-4' />
                                Spectating
                            </Badge>
                        )}
                    </h1>
                    {isSeries && gameData.status === 'in_play' && (
                        <p className='text-primary font-semibold text-base sm:text-lg mt-1'>
                            {matchFormatName} - Score: {players[0]?.name}{' '}
                            {gameData.player1Score || 0} vs {players[1]?.name || 'P2'}{' '}
                            {gameData.player2Score || 0}
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
                    player={players[0]}
                    isActive={
                        players[0].id === gameData.currentPlayerId && gameData.status === 'in_play'
                    }
                    displayedReaction={player1DisplayedReaction}
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
                    <div
                        data-ai-hint='tic-tac-toe board'
                        className='w-full max-w-[200px] sm:max-w-[256px] aspect-square bg-muted rounded-lg flex items-center justify-center text-muted-foreground shadow-md mb-4'
                    >
                        <div className='grid grid-cols-3 gap-1 sm:gap-2 p-1 sm:p-2 w-full h-full'>
                            {Array(9)
                                .fill(null)
                                .map((_, i) => (
                                    <div
                                        key={i}
                                        className={cn(
                                            'w-full h-full bg-background rounded flex items-center justify-center text-2xl sm:text-3xl font-bold transition-colors',
                                            !isSpectator &&
                                                gameData.status === 'in_play' &&
                                                'hover:bg-muted cursor-pointer'
                                        )}
                                    ></div>
                                ))}
                        </div>
                    </div>
                    <p className='text-sm text-muted-foreground text-center'>
                        {gameData.status === 'in_play'
                            ? `${currentPlayerDetails?.name || 'N/A'}'s turn.`
                            : gameData.status === 'open'
                            ? 'Waiting for opponent...'
                            : `Game Finished. Winner: ${
                                  gameData.winnerWallet
                                      ? gameData.winnerWallet.substring(0, 4) +
                                        '...' +
                                        gameData.winnerWallet.substring(
                                            gameData.winnerWallet.length - 4
                                        )
                                      : 'N/A'
                              }`}
                    </p>
                    {isAITurn && !isSpectator && (
                        <p className='text-sm text-accent flex items-center mt-2'>
                            <Bot className='h-4 w-4 mr-1' /> AI is thinking...
                        </p>
                    )}
                    {gameData.status === 'open' && (
                        <p className='text-lg font-semibold text-primary mt-2'>
                            Waiting for opponent to join & stake...
                        </p>
                    )}

                    {!isSpectator && gameData.status === 'in_play' && (
                        <div className='mt-4 flex flex-col sm:flex-row gap-2 w-full max-w-xs'>
                            <Button
                                size='sm'
                                variant='destructive'
                                onClick={() => simulateEndSingleGame(false)}
                                className='flex-1'
                            >
                                Simulate Game Loss
                            </Button>
                            <Button
                                size='sm'
                                className='bg-green-500 hover:bg-green-600 flex-1'
                                onClick={() => simulateEndSingleGame(true)}
                            >
                                Simulate Game Win
                            </Button>
                        </div>
                    )}
                    {gameData.turnStartTimestamp && (
                        <p className='text-xs text-muted-foreground mt-2'>
                            Turn started:{' '}
                            {gameData.turnStartTimestamp.toDate().toLocaleTimeString()}
                        </p>
                    )}
                </Card>

                {players[1] && (
                    <PlayerCard
                        player={players[1]}
                        isActive={
                            players[1].id === gameData.currentPlayerId &&
                            gameData.status === 'in_play'
                        }
                        displayedReaction={player2DisplayedReaction}
                    />
                )}
                {!players[1] && gameData.maxPlayers > 1 && gameData.status !== 'finished' && (
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

            {!isSpectator && gameData.status === 'in_play' && (
                <Card className='mt-6'>
                    <CardHeader className='p-3 sm:p-4 !pb-2'>
                        <CardTitle className='text-center font-headline text-lg sm:text-xl'>
                            Send Reaction
                        </CardTitle>
                    </CardHeader>
                    <CardContent className='p-3 sm:p-4 flex flex-wrap justify-center items-center gap-2'>
                        {reactionEmojis.map((emoji) => (
                            <Button
                                key={emoji}
                                variant='outline'
                                size='icon'
                                className='text-xl sm:text-2xl w-10 h-10 sm:w-12 sm:h-12 rounded-full hover:bg-primary/10 focus:ring-accent'
                                onClick={() => sendReaction(emoji)}
                                disabled={isSpectator || !gameData || gameData.status !== 'in_play'}
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
                                {matchFormatName}
                            </p>
                        </div>
                        <div>
                            <p className='text-xs sm:text-sm text-muted-foreground'>
                                Stake (per player)
                            </p>
                            <p className='font-semibold text-base sm:text-lg flex items-center justify-center'>
                                <Coins className='h-4 w-4 sm:h-5 sm:w-5 mr-1 text-yellow-500' />{' '}
                                {gameData.stakeAmount} {gameData.token}
                            </p>
                        </div>
                        <div>
                            <p className='text-xs sm:text-sm text-muted-foreground'>
                                Net Prize for Winner
                            </p>
                            <p className='font-semibold text-base sm:text-lg text-primary flex items-center justify-center'>
                                <Coins className='h-4 w-4 sm:h-5 sm:w-5 mr-1 text-primary' />{' '}
                                {netPrizeForWinner.toFixed(4)} {gameData.token}
                            </p>
                        </div>
                        <div>
                            <p className='text-xs sm:text-sm text-muted-foreground'>Status</p>
                            <p className='font-semibold text-base sm:text-lg flex items-center justify-center'>
                                <Badge
                                    variant={
                                        gameData.status === 'in_play'
                                            ? 'default'
                                            : gameData.status === 'open'
                                            ? 'secondary'
                                            : 'destructive'
                                    }
                                    className='text-xs sm:text-sm capitalize'
                                >
                                    {gameData.status.replace('_', ' ')}
                                </Badge>
                            </p>
                        </div>
                    </div>
                    <Separator />
                    <CardDescription className='text-xs text-muted-foreground text-center'>
                        Platform fee: {PLATFORM_FEE_PERCENT}% of total stake. Solana network fees
                        also apply to transactions.
                    </CardDescription>
                    {gameData.status === 'in_play' &&
                        timeLeft !== null &&
                        gameData.turnTimeLimit && (
                            <div>
                                <div className='flex justify-between items-center mb-2'>
                                    <p className='text-sm font-medium flex items-center'>
                                        <Clock className='h-5 w-5 mr-2 text-primary' /> Time Left
                                        for Game Turn:
                                    </p>
                                    <Badge
                                        variant={
                                            timeLeft < gameData.turnTimeLimit * 0.1
                                                ? 'destructive'
                                                : 'default'
                                        }
                                        className='text-base sm:text-lg px-3 py-1'
                                    >
                                        {Math.floor(timeLeft / 60)}:
                                        {String(timeLeft % 60).padStart(2, '0')}
                                    </Badge>
                                </div>
                                <Progress
                                    value={(timeLeft / gameData.turnTimeLimit) * 100}
                                    className='h-2 sm:h-3'
                                />
                                <CardDescription className='text-xs text-muted-foreground mt-2 flex items-center'>
                                    <AlertTriangle className='h-4 w-4 mr-1 text-destructive' /> If
                                    the timer reaches zero, your opponent wins this game by default.
                                </CardDescription>
                                {timeLeft === 0 &&
                                    !isSpectator &&
                                    publicKey &&
                                    gameData.currentPlayerId === publicKey.toBase58() && (
                                        <p className='text-xs text-destructive mt-1'>
                                            Processing...
                                        </p>
                                    )}
                            </div>
                        )}
                </CardContent>
                {!isSpectator && gameData.status === 'in_play' && (
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
