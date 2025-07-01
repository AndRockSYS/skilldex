'use client';

import { Trophy } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import LeaderboardTable from '@/components/leaderboard/leaderboard-table';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useState } from 'react';

import { UserStats } from '@/types/user';

export default async function LeaderboardPage() {
    // todo replace with useQuery
    const [users, setUsers] = useState<UserStats[]>([]);
    const error = '';

    return (
        <div className='container mx-auto py-8 px-4'>
            <Card className='shadow-xl'>
                <CardHeader className='text-center'>
                    <Trophy className='mx-auto h-12 w-12 text-yellow-400 mb-3' />
                    <CardTitle className='font-headline text-3xl sm:text-4xl'>
                        <span className='rainbow-text'>Leaderboard</span>
                    </CardTitle>
                    <CardDescription className='text-base sm:text-lg text-muted-foreground'>
                        See who's dominating SKILLDEX.IO! Points are earned by creating, playing,
                        and winning challenges.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {error && (
                        <Alert variant='destructive' className='mb-6'>
                            <AlertTitle>Error Loading Leaderboard</AlertTitle>
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}
                    {!error && users.length === 0 && (
                        <p className='text-center text-muted-foreground py-10'>
                            The leaderboard is currently empty. Be the first to make your mark!
                        </p>
                    )}
                    {!error && users.length > 0 && <LeaderboardTable users={users} />}
                </CardContent>
            </Card>
        </div>
    );
}
