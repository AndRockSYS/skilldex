'use client';

import { Avatar, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useWallet } from '@solana/wallet-adapter-react';

import { EXPLORER_URL } from '@/utils/constants';
import { formatWallet } from '@/utils/formatter';

import { getStatusName, Player, PlayerStatus } from '@/types/user';
import { GameState, Lobby, Reaction } from '@/types/games';

export default function PlayerCard({
    lobby,
    player,
    turnWallet,
    isActive,
    reaction,
}: {
    lobby: Lobby;
    player: Player;
    turnWallet: string;
    isActive: boolean;
    reaction: Reaction | undefined;
}) {
    const { publicKey } = useWallet();
    const [displayReaction, setDisplayReaction] = useState<Reaction>();

    useEffect(() => {
        if (!reaction) return;
        setDisplayReaction(reaction);

        const timeout = setTimeout(() => setDisplayReaction(undefined), 5_000);
        return () => clearTimeout(timeout);
    }, [reaction]);

    return (
        <Card
            className={`relative transition-all duration-300 ${
                isActive ? 'border-primary shadow-primary/30 shadow-lg' : 'opacity-70'
            }`}
        >
            {displayReaction && (
                <div
                    key={reaction + player.wallet + Date.now()}
                    className='absolute top-1 right-1 text-3xl md:text-4xl z-20 p-1 animate-fadeInOut'
                    style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
                >
                    {displayReaction.emoji}
                </div>
            )}
            <CardHeader className='flex flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4'>
                <Avatar className='h-12 w-12 sm:h-16 sm:w-16 border-2 border-primary'>
                    <AvatarImage
                        src={player.avatar || `https://placehold.co/64x64.png`}
                        alt={player.name}
                        data-ai-hint='player avatar'
                    />
                </Avatar>
                <div>
                    <CardTitle className='font-headline text-lg sm:text-xl'>
                        {player.name ?? formatWallet(player.wallet)}{' '}
                        {player.wallet == publicKey?.toString() && '(You)'}
                    </CardTitle>
                    <div className='flex items-center mt-1'>
                        <Badge
                            variant={player.wallet == turnWallet ? 'default' : 'secondary'}
                            className='text-xs sm:text-sm'
                        >
                            {lobby.state == GameState.Finished
                                ? getStatusName(PlayerStatus.Finished)
                                : player.wallet == turnWallet
                                ? getStatusName(PlayerStatus.Thinking)
                                : getStatusName(PlayerStatus.Waiting)}
                        </Badge>
                        {player.score > 0 && (
                            <Badge variant='outline' className='ml-2 text-xs sm:text-sm'>
                                Score: {player.score}
                            </Badge>
                        )}
                        {player.txSignature && (
                            <Button variant='default' className='ml-2 text-xs sm:text-sm'>
                                <Link href={EXPLORER_URL(player.txSignature)} target='_blank'>
                                    Signature
                                </Link>
                            </Button>
                        )}
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
