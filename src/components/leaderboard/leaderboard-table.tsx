'use client';

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, UserCircle2, Star, Hash } from 'lucide-react';

import { cn } from '@/lib/utils';

import { UserStats } from '@/types/user';
import { formatWallet } from '@/utils/formatter';

interface Props {
    users: UserStats[];
}

export default function LeaderboardTable({ users }: Props) {
    if (!users.length) {
        return <p className='text-center text-muted-foreground py-6'>No data to display.</p>;
    }

    return (
        <div className='overflow-x-auto rounded-lg border shadow-md'>
            <Table>
                <TableHeader>
                    <TableRow className='bg-muted/50 hover:bg-muted/50'>
                        <TableHead className='w-[80px] text-center font-semibold'>
                            <Hash className='inline-block h-5 w-5 mr-1 text-muted-foreground' />{' '}
                            Rank
                        </TableHead>
                        <TableHead className='font-semibold'>
                            <UserCircle2 className='inline-block h-5 w-5 mr-1 text-muted-foreground' />{' '}
                            Player
                        </TableHead>
                        <TableHead className='text-right font-semibold'>
                            <Star className='inline-block h-5 w-5 mr-1 text-yellow-400' /> Points
                        </TableHead>
                        <TableHead className='hidden sm:table-cell text-right font-semibold'>
                            Created
                        </TableHead>
                        <TableHead className='hidden sm:table-cell text-right font-semibold'>
                            Played
                        </TableHead>
                        <TableHead className='hidden md:table-cell text-right font-semibold'>
                            Won
                        </TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.map((user, index) => (
                        <TableRow
                            key={user.walletAddress}
                            className={cn(
                                'transition-colors',
                                index === 0 &&
                                    'bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-400 font-bold', // Gold
                                index === 1 &&
                                    'bg-slate-500/10 hover:bg-slate-500/20 text-slate-300 font-semibold', // Silver
                                index === 2 &&
                                    'bg-amber-600/10 hover:bg-amber-600/20 text-amber-500 font-semibold' // Bronze
                            )}
                        >
                            <TableCell className='text-center font-medium text-lg'>
                                {index === 0 && (
                                    <Trophy className='inline-block h-5 w-5 text-yellow-400 mr-1' />
                                )}
                                {index === 1 && (
                                    <Trophy className='inline-block h-5 w-5 text-slate-400 mr-1' />
                                )}
                                {index === 2 && (
                                    <Trophy className='inline-block h-5 w-5 text-amber-500 mr-1' />
                                )}
                                {user.rank || index + 1}
                            </TableCell>
                            <TableCell>
                                <div className='flex items-center gap-3'>
                                    <Avatar className='h-8 w-8 sm:h-10 sm:w-10 border-2 border-primary/50'>
                                        <AvatarImage
                                            src={`https://placehold.co/40x40.png`}
                                            alt={
                                                user.displayName || formatWallet(user.walletAddress)
                                            }
                                            data-ai-hint='user avatar'
                                        />
                                        <AvatarFallback>
                                            {(user.displayName || user.walletAddress)
                                                .substring(0, 2)
                                                .toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                    <span className='font-medium truncate'>
                                        {user.displayName || formatWallet(user.walletAddress)}
                                    </span>
                                </div>
                            </TableCell>
                            <TableCell className='text-right font-bold text-lg text-primary'>
                                {user.points.toLocaleString()}
                            </TableCell>
                            <TableCell className='hidden sm:table-cell text-right text-muted-foreground'>
                                {user.games.created?.toLocaleString() || 0}
                            </TableCell>
                            <TableCell className='hidden sm:table-cell text-right text-muted-foreground'>
                                {user.games.played?.toLocaleString() || 0}
                            </TableCell>
                            <TableCell className='hidden md:table-cell text-right text-muted-foreground'>
                                {user.games.won?.toLocaleString() || 0}
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>
    );
}
