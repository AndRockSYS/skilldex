'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import EndGameScreen from '@/components/game/end-game-screen';

import { useWallet } from '@solana/wallet-adapter-react';
import { useToast } from '@/hooks/use-toast';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';

import GameDatabase from '@/lib/firebase/games';

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
        queryFn: async () => await GameDatabase.fetchLobbyById(Number(gameId)),
        throwOnError: (error) => {
            toast({
                title: 'Error',
                description: 'Game data not found.',
                variant: 'destructive',
            });
            throw error;
        },
        enabled: !!gameId && !Number.isNaN(Number(gameId)),
    });

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

    return <EndGameScreen lobby={lobbyData} isWinner={lobbyData.winner == publicKey.toString()} />;
}
