'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import ShareResult from './share-result';
import Confetti from 'react-confetti';
import { Award, Frown, Home } from 'lucide-react';

import { useEffect, useMemo, useState } from 'react';

import { Token } from '@/types/utils';
import { GameType, getGameName, getMatchFormatName, MatchFormat } from '@/types/games';
import { formatTokenAmount } from '@/utils/formatter';
import { PLATFORM_COMMISSION } from '@/utils/constants';

interface Props {
    gameId: number;
    gameType: GameType;
    matchFormat: MatchFormat;

    isWinner: boolean;

    stake: {
        initial: bigint;
        pool: bigint;
        token: Token;
    };

    scores?: {
        creator: number;
        oponent: number;
    };
}

export default function EndGameScreen({
    gameId,
    gameType,
    matchFormat,
    isWinner,
    stake,
    scores,
}: Props) {
    const [showConfetti, setShowConfetti] = useState(false);
    const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

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

    const commission = useMemo(() => stake.pool * BigInt(PLATFORM_COMMISSION / 100), [stake]);

    const message = useMemo(() => {
        const score = `${scores?.creator}-${scores?.oponent})`;
        const isSingle = matchFormat == MatchFormat.Single;

        if (!isWinner) return `You Lost The Match. ${!isSingle ? `Score: ${score}` : ''}`;
        return `You Won ${formatTokenAmount(stake.pool - commission, stake.token)} ${
            stake.token
        }! ${!isSingle ? `Series: ${score}` : ''}`;
    }, [isWinner, scores, stake, commission]);

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
                                    <span className='font-medium'>{getGameName(gameType)}</span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Format:</span>{' '}
                                    <span className='font-medium'>
                                        {getMatchFormatName(matchFormat)}
                                    </span>
                                </div>
                                {matchFormat !== MatchFormat.Single && (
                                    <div className='flex justify-between'>
                                        <span>Final Score:</span>{' '}
                                        <span className='font-medium'>
                                            {scores?.creator} - {scores?.oponent}
                                        </span>
                                    </div>
                                )}
                                <div className='flex justify-between'>
                                    <span>Your Stake:</span>{' '}
                                    <span className='font-medium'>
                                        {formatTokenAmount(stake.initial, stake.token)}{' '}
                                        {stake.token}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Opponent's Stake:</span>{' '}
                                    <span className='font-medium'>
                                        {formatTokenAmount(stake.initial, stake.token)}{' '}
                                        {stake.token}
                                    </span>
                                </div>
                                <Separator className='my-1.5' />
                                <div className='flex justify-between'>
                                    <span>Total Prize Pool:</span>{' '}
                                    <span className='font-medium'>
                                        {formatTokenAmount(stake.pool, stake.token)} {stake.token}
                                    </span>
                                </div>
                                <div className='flex justify-between'>
                                    <span>Platform Fee ({PLATFORM_COMMISSION}%):</span>{' '}
                                    <span className='font-medium text-destructive'>
                                        -{formatTokenAmount(commission, stake.token)} {stake.token}
                                    </span>
                                </div>
                                <Separator className='my-1.5' />
                                <div className='flex justify-between text-base'>
                                    <span className='font-bold text-primary'>
                                        Your Net Winnings:
                                    </span>
                                    <span className='font-bold text-primary'>
                                        {formatTokenAmount(stake.pool - commission, stake.token)}{' '}
                                        {stake.token}
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

                    {
                        !isWinner && gameId && <></>
                        // todo remake links after solana game implementation
                        // <div className='grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4'>
                        //     <Button
                        //         variant='outline'
                        //         size='lg'
                        //         asChild
                        //         className='text-sm sm:text-base'
                        //     >
                        //         <Link
                        //             href={`/create-challenge?game=${gameIdSlug}&stake=${originalStakeAmount}&token=${token}&matchFormat=${matchFormat}`}
                        //         >
                        //             <RotateCcw className='mr-2 h-4 w-4 sm:h-5 sm:w-5' /> Rematch (
                        //             {getMatchFormatName(matchFormat)})
                        //         </Link>
                        //     </Button>
                        //     <Button
                        //         variant='outline'
                        //         size='lg'
                        //         asChild
                        //         className='border-accent text-accent hover:bg-accent/10 hover:text-accent text-sm sm:text-base'
                        //     >
                        //         <Link
                        //             href={`/create-challenge?game=${gameIdSlug}&stake=${
                        //                 originalStakeAmount * 2
                        //             }&token=${token}&matchFormat=single`}
                        //         >
                        //             <DollarSign className='mr-1 h-4 w-4 sm:h-5 sm:w-5' />
                        //             <ArrowUp className='mr-2 h-3 w-3 sm:h-4 sm:w-4 -ml-1' />
                        //             Double or Nothing (Single)
                        //         </Link>
                        //     </Button>
                        // </div>
                    }

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
                            isWinner && matchFormat != MatchFormat.Single
                                ? `Final Score: ${scores?.creator}-${scores?.oponent}`
                                : ''
                        } 🏆 Come join the fun on Solana:`}
                    />
                </CardContent>
            </Card>
        </div>
    );
}
