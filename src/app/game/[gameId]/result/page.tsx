'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EndGameScreen from '@/components/game/end-game-screen';

import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';

import { Lobby, MatchFormat } from '@/types/games';

export default function WinPage() {
    const { gameId } = useParams();
    const { toast } = useToast();

    const { publicKey } = useWallet();

    const {
        data: lobbyData,
        isFetching,
        error,
    } = useQuery({
        queryKey: ['game', gameId],
        queryFn: async () => {
            // todo fetch and return the game
            return {} as Lobby;
        },
        throwOnError: (error) => {
            toast({
                title: 'Error',
                description: 'Game data not found.',
                variant: 'destructive',
            });
            throw error;
        },
    });

    useEffect(() => {
        if (!gameId)
            toast({ title: 'Error', description: 'No game ID provided.', variant: 'destructive' });
    }, [gameId]);

    if (isFetching || !lobbyData || !publicKey)
        return (
            <div className='flex justify-center items-center h-screen'>
                <p>Calculating your winnings...</p>
            </div>
        );

    if (error)
        return (
            <div className='flex flex-col items-center justify-center min-h-[70vh] text-center p-4'>
                <p className='text-destructive mb-2'>Could not load all game and prize details.</p>
                <p className='mb-4'>
                    An error occurred while fetching game information. Please check the lobby for
                    game status or contact support.
                </p>
                <Button variant='outline' asChild>
                    <Link href='/lobby'>Back to Lobby</Link>
                </Button>
            </div>
        );

    return (
        <EndGameScreen
            gameId={lobbyData.id}
            gameType={lobbyData.gameType}
            matchFormat={lobbyData.format}
            isWinner={lobbyData.winner ? lobbyData.winner == publicKey.toString() : false}
            stake={{ pool: BigInt(lobbyData.pool.amount), token: lobbyData.pool.token }}
            scores={
                lobbyData.format == MatchFormat.Single
                    ? undefined
                    : { creator: lobbyData.score.creator, oponent: lobbyData.score.opponent }
            }
        />
    );
}
