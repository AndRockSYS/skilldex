'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TabsContent } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';

import { useCallback, useState } from 'react';

import { FlaggedGameEntry } from '@/types/admin';

interface Props {
    flaggedGames: FlaggedGameEntry[];
}

export default function FlaggedGames({ flaggedGames }: Props) {
    const [isResolving, setIsResolving] = useState(false);

    const handleResolveFlaggedGame = useCallback(async (id: string) => {}, []);

    return (
        <TabsContent value='flags' className='mt-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Flagged Games</CardTitle>
                    <CardDescription>Review games flagged by users.</CardDescription>
                </CardHeader>
                <CardContent>
                    {flaggedGames.length === 0 && <p>No games have been flagged.</p>}
                    <div className='space-y-2 max-h-96 overflow-y-auto'>
                        {flaggedGames.map((flag) => (
                            <Card key={flag.id} className='p-3'>
                                <p>
                                    Game ID:{' '}
                                    <Link
                                        href={`/game/${flag.gameId}`}
                                        target='_blank'
                                        className='text-primary hover:underline'
                                    >
                                        {flag.gameId}
                                    </Link>
                                </p>
                                <p>Reason: {flag.reason}</p>
                                <p className='text-xs text-muted-foreground'>
                                    Flagged by: {flag.reporterWallet || 'System/Unknown'}
                                </p>
                                <p className='text-xs text-muted-foreground'>
                                    Date: {new Date(flag.flaggedAt.toMillis()).toLocaleString()}
                                </p>
                                <p>
                                    Status:{' '}
                                    <Badge
                                        variant={
                                            flag.status === 'resolved' ? 'default' : 'secondary'
                                        }
                                    >
                                        {flag.status}
                                    </Badge>
                                </p>
                                {flag.resolutionNotes && (
                                    <p className='text-xs mt-1'>
                                        Resolution: {flag.resolutionNotes}
                                    </p>
                                )}
                                {flag.status === 'open' && (
                                    <Button
                                        size='sm'
                                        variant='outline'
                                        onClick={() => handleResolveFlaggedGame(flag.id)}
                                        disabled={isResolving}
                                        className='mt-2'
                                    >
                                        Resolve Flag
                                    </Button>
                                )}
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
