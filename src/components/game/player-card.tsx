'use client';

import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Card, CardHeader, CardTitle } from '../ui/card';

import { formatWallet } from '@/utils/formatter';

import { getStatusName, Player, PlayerStatus } from '@/types/user';

export default function PlayerCard({
    player,
    turnWallet,
    isActive,
    displayedReaction,
}: {
    player: Player;
    turnWallet: string;
    isActive: boolean;
    displayedReaction: string | null;
}) {
    return (
        <Card
            className={`relative transition-all duration-300 ${
                isActive ? 'border-primary shadow-primary/30 shadow-lg' : 'opacity-70'
            }`}
        >
            {displayedReaction && (
                <div
                    key={displayedReaction + player.wallet + Date.now()}
                    className='absolute top-1 right-1 text-3xl md:text-4xl z-20 p-1 animate-fadeInOut'
                    style={{ textShadow: '1px 1px 3px rgba(0,0,0,0.5)' }}
                >
                    {displayedReaction}
                </div>
            )}
            <CardHeader className='flex flex-row items-center gap-3 sm:gap-4 p-3 sm:p-4'>
                <Avatar className='h-12 w-12 sm:h-16 sm:w-16 border-2 border-primary'>
                    <AvatarImage
                        src={player.avatar || `https://placehold.co/64x64.png`}
                        alt={player.name}
                        data-ai-hint='player avatar'
                    />
                    <AvatarFallback>
                        {player.name?.substring(0, 2).toUpperCase() ?? formatWallet(player.wallet)}
                    </AvatarFallback>
                </Avatar>
                <div>
                    <CardTitle className='font-headline text-lg sm:text-xl'>
                        {player.name} {player.wallet == turnWallet && '(You)'}
                    </CardTitle>
                    <div className='flex items-center mt-1'>
                        <Badge
                            variant={player.wallet == turnWallet ? 'default' : 'secondary'}
                            className='text-xs sm:text-sm'
                        >
                            {player.wallet == turnWallet
                                ? getStatusName(PlayerStatus.Thinking)
                                : getStatusName(PlayerStatus.Waiting)}
                        </Badge>
                        {player.score > 0 && (
                            <Badge variant='outline' className='ml-2 text-xs sm:text-sm'>
                                Score: {player.score}
                            </Badge>
                        )}
                    </div>
                </div>
            </CardHeader>
        </Card>
    );
}
