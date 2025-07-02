'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, History } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';

import { useCallback, useState } from 'react';

import { ModerationAction, ModerationEntry } from '@/types/admin';

interface Props {
    moderationList: ModerationEntry[];
}

export default function Moderation({ moderationList }: Props) {
    const [isProcessing, setIsProcessing] = useState(false);

    const [modWalletAddress, setModWalletAddress] = useState('');
    const [modAction, setModAction] = useState<ModerationAction>('warn');
    const [modReason, setModReason] = useState('');

    // todo rewrite form with the form hook

    const handleModerationSubmit = useCallback(() => {
        // todo add
    }, []);

    return (
        <TabsContent value='moderation' className='mt-6'>
            <Card>
                <CardHeader>
                    <CardTitle>User Moderation</CardTitle>
                    <CardDescription>Apply warnings or bans to user wallets.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleModerationSubmit} className='space-y-4 mb-6'>
                        <Input
                            type='text'
                            placeholder='User Wallet Address'
                            value={modWalletAddress}
                            onChange={(e) => setModWalletAddress(e.target.value)}
                            required
                        />
                        <Select
                            value={modAction}
                            onValueChange={(value: ModerationAction) => setModAction(value)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder='Select action' />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value='warn'>Warn User</SelectItem>
                                <SelectItem value='ban'>Ban User</SelectItem>
                                <SelectItem value='unban'>Unban/Reactivate User</SelectItem>
                            </SelectContent>
                        </Select>
                        <Textarea
                            placeholder='Reason for action (required)'
                            value={modReason}
                            onChange={(e) => setModReason(e.target.value)}
                            required
                        />
                        <Button type='submit' disabled={isProcessing}>
                            {isProcessing && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
                            Apply Action
                        </Button>
                    </form>
                    <h3 className='font-headline text-lg mb-2'>Moderation List</h3>
                    {moderationList.length === 0 && (
                        <p>No users have moderation actions applied.</p>
                    )}
                    <div className='space-y-2 max-h-96 overflow-y-auto'>
                        {moderationList.map((modUser) => (
                            <Card
                                key={modUser.wallet + modUser.lastUpdatedAt.toMillis()}
                                className='p-3'
                            >
                                <p className='font-mono text-sm break-all'>
                                    Wallet: {modUser.wallet}
                                </p>
                                <p>
                                    Status:{' '}
                                    <Badge
                                        variant={
                                            modUser.currentStatus == 'ban'
                                                ? 'destructive'
                                                : modUser.currentStatus == 'warn'
                                                ? 'secondary'
                                                : 'default'
                                        }
                                    >
                                        {modUser.currentStatus}
                                    </Badge>
                                </p>
                                {modUser.lastReason && (
                                    <p className='text-xs text-muted-foreground'>
                                        Last Reason: {modUser.lastReason}
                                    </p>
                                )}
                                <p className='text-xs text-muted-foreground'>
                                    Last Updated:{' '}
                                    {new Date(modUser.lastUpdatedAt.toMillis()).toLocaleString()}
                                </p>
                                <AlertDialog>
                                    <AlertDialogTrigger asChild>
                                        <Button
                                            variant='outline'
                                            size='sm'
                                            className='mt-1 text-xs'
                                        >
                                            <History className='mr-1.5 h-3 w-3' />
                                            View History
                                        </Button>
                                    </AlertDialogTrigger>
                                    <AlertDialogContent>
                                        <AlertDialogHeader>
                                            <AlertDialogTitle>
                                                Moderation History for{' '}
                                                {modUser.wallet.substring(0, 6)}
                                                ...
                                            </AlertDialogTitle>
                                            <AlertDialogDescription className='max-h-60 overflow-y-auto'>
                                                {modUser.moderationHistory
                                                    ?.slice()
                                                    .reverse()
                                                    .map((hist, idx) => (
                                                        <div
                                                            key={idx}
                                                            className='py-2 border-b last:border-b-0'
                                                        >
                                                            <p>
                                                                <strong>Action:</strong>{' '}
                                                                {hist.action}
                                                            </p>
                                                            <p>
                                                                <strong>Reason:</strong>{' '}
                                                                {hist.reason}
                                                            </p>
                                                            <p>
                                                                <strong>Date:</strong>{' '}
                                                                {new Date(
                                                                    hist.timestamp.toMillis()
                                                                ).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    ))}
                                                {!modUser.moderationHistory?.length && (
                                                    <p>No history recorded.</p>
                                                )}
                                            </AlertDialogDescription>
                                        </AlertDialogHeader>
                                        <AlertDialogFooter>
                                            <AlertDialogCancel>Close</AlertDialogCancel>
                                        </AlertDialogFooter>
                                    </AlertDialogContent>
                                </AlertDialog>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
