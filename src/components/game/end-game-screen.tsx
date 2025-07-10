'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ShareResult from './share-result';
import Confetti from 'react-confetti';
import { Award, DollarSign, Frown, Home, RotateCcw } from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

import { PLATFORM_COMMISSION } from '@/utils/constants';

import { formatTokenAmount } from '@/utils/formatter';

import { getGameName, getMatchFormatName, Lobby, MatchFormat } from '@/types/games';
import { getTokenName } from '@/types/utils';
import useProgram from '@/hooks/use-program';

interface Props {
    lobby: Lobby;
    isWinner: boolean;
}

export default function EndGameScreen({ lobby, isWinner }: Props) {
    const { declareWinner } = useProgram();

    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

    useEffect(() => {
        if (isWinner) declareWinner(lobby.id);
    }, []);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setWindowSize({ width: window.innerWidth, height: window.innerHeight });
            const handleResize = () =>
                setWindowSize({ width: window.innerWidth, height: window.innerHeight });
            window.addEventListener('resize', handleResize);

            if (isWinner) {
                setShowConfetti(true);
                const timer = setTimeout(() => setShowConfetti(false), 8000);
                return () => clearTimeout(timer);
            }

            return () => window.removeEventListener('resize', handleResize);
        }
    }, [isWinner]);

    const commission = useMemo(() => lobby.pool.initial * 2 * (PLATFORM_COMMISSION / 100), [lobby]);
    const scores = useMemo(() => `${lobby.creator.score} - ${lobby.opponent?.score}`, [lobby]);

    const message = useMemo(
        () =>
            !isWinner
                ? `You Lost The Match.`
                : `You Won ${formatTokenAmount(
                      lobby.pool.initial * 2 - commission,
                      lobby.pool.token
                  )} ${getTokenName(lobby.pool.token)}!`,
        [isWinner, lobby, scores, commission]
    );

    return (
        <div className='flex flex-col items-center justify-center min-h-[70vh] text-center p-4'>
            {showConfetti && (
                <Confetti
                    width={windowSize.width}
                    height={windowSize.height}
                    recycle={false}
                    numberOfPieces={window.innerWidth < 768 ? 150 : 300}
                />
            )}
            <Card className='w-full max-w-lg shadow-2xl'>
                <CardHeader>
                    {isWinner ? (
                        <Award className='mx-auto h-16 w-16 sm:h-20 sm:w-20 text-yellow-400 mb-4' />
                    ) : (
                        <Frown className='mx-auto h-16 w-16 sm:h-20 sm:w-20 text-destructive mb-4' />
                    )}
                    <CardTitle
                        className={`font-headline text-3xl sm:text-4xl ${
                            isWinner ? 'text-primary' : 'text-destructive'
                        }`}
                    >
                        {isWinner ? 'Congratulations!' : 'Better Luck Next Time!'}
                    </CardTitle>
                    <CardDescription className='text-base sm:text-lg'>{message}</CardDescription>
                </CardHeader>
                <CardContent className='space-y-6'>
                    {isWinner && (
                        <Card className='bg-muted p-4 text-sm'>
                            <CardTitle className='text-lg font-semibold mb-3 text-center'>
                                Match Summary
                            </CardTitle>
                            <div className='space-y-1.5'>
                                <div className='flex justify-between'>
                                    <span>Game:</span>{' '}
                                    <span className='font-medium'>
                                        {getGameName(lobby.gameType)}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Format:</span>{' '}
                                    <span className='font-medium'>
                                        {getMatchFormatName(lobby.format)}
                                    </span>
                                </div>
                                {lobby.format !== MatchFormat.Single && (
                                    <div className='flex justify-between'>
                                        <span>Final Score:</span>{' '}
                                        <span className='font-medium'>{scores}</span>
                                    </div>
                                )}
                                <Separator className='my-1.5' />
                                <div className='flex justify-between'>
                                    <span>Total Prize Pool:</span>{' '}
                                    <span className='font-medium'>
                                        {formatTokenAmount(
                                            lobby.pool.initial * 2,
                                            lobby.pool.token
                                        )}{' '}
                                        {getTokenName(lobby.pool.token)}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Platform Fee ({PLATFORM_COMMISSION}%):</span>{' '}
                                    <span className='font-medium text-destructive'>
                                        -{formatTokenAmount(commission, lobby.pool.token)}{' '}
                                        {getTokenName(lobby.pool.token)}
                                    </span>
                                </div>
                                <Separator className='my-1.5' />
                                <div className='flex justify-between text-base'>
                                    <span className='font-bold text-primary'>
                                        Your Net Winnings:
                                    </span>
                                    <span className='font-bold text-primary'>
                                        {formatTokenAmount(
                                            lobby.pool.initial * 2 - commission,
                                            lobby.pool.token
                                        )}{' '}
                                        {getTokenName(lobby.pool.token)}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    )}

                    <p className='text-muted-foreground text-sm sm:text-base'>
                        {isWinner
                            ? 'Your winnings are being processed and will be sent to your connected wallet shortly.'
                            : "Don't give up! Every match is a new learning opportunity."}
                    </p>

                    {!isWinner && lobby && (
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                            <Button
                                variant='outline'
                                size='lg'
                                asChild
                                className='text-sm sm:text-base'
                            >
                                <Link
                                    href={`/create-lobby?gameTypeId=${
                                        lobby.gameType
                                    }&stake=${Number(lobby.pool.initial)}&matchFormat=${
                                        lobby.format
                                    }`}
                                >
                                    <RotateCcw className='mr-2 h-4 w-4 sm:h-5 sm:w-5' /> Rematch
                                </Link>
                            </Button>
                            <Button
                                variant='outline'
                                size='lg'
                                asChild
                                className='border-accent text-accent hover:bg-accent/10 hover:text-accent text-sm sm:text-base'
                            >
                                <Link
                                    href={`/create-lobby?gameTypeId=${lobby.gameType}&stake=${
                                        Number(lobby.pool.initial) * 2
                                    }`}
                                >
                                    <DollarSign className='mr-1 h-4 w-4 sm:h-5 sm:w-5' />
                                    Double or Nothing
                                </Link>
                            </Button>
                        </div>
                    )}

                    <Button
                        size='lg'
                        asChild
                        className='w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm sm:text-base'
                    >
                        <Link href='/lobby'>
                            <Home className='mr-2 h-4 w-4 sm:h-5 sm:w-5' /> Back to Lobby
                        </Link>
                    </Button>
                    <ShareResult
                        text={`I just ${
                            isWinner ? 'won my match' : 'played a game'
                        } on SKILLDEX.IO! ${
                            isWinner && lobby.format != MatchFormat.Single
                                ? `Final Score: ${scores}`
                                : ''
                        } 🏆 Come join the fun on Solana:`}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
