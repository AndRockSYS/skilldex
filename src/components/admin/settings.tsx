'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';

import { useState } from 'react';
import useProgram from '@/hooks/use-program';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

import { web3 } from '@coral-xyz/anchor';
import { LAMPORTS_PER_SOL } from '@solana/web3.js';

export default function Settings() {
    const { toast } = useToast();
    const {
        initializePlatform,
        updatePlatform,
        withdrawCommission,
        isProcessing,
        fetchPlatformData,
    } = useProgram();

    const {
        data: platformData,
        isError,
        isFetching,
        refetch,
    } = useQuery({
        queryKey: ['admin', 'platform'],
        queryFn: async () => await fetchPlatformData(),
    });

    const [newPlatform, setNewPlatform] = useState<string>('');

    return (
        <TabsContent value='settings' className='mt-6'>
            <Card>
                <CardContent>
                    <CardHeader className='px-0'>
                        <CardTitle>Initialize Platform</CardTitle>{' '}
                        <CardDescription>
                            Do it only if the platform was not initialized before
                        </CardDescription>
                    </CardHeader>
                    <Button
                        disabled={isProcessing}
                        onClick={async () => {
                            await initializePlatform();
                            refetch();
                        }}
                    >
                        {isProcessing && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Initialize
                    </Button>
                </CardContent>
            </Card>
            <Card className='mt-6'>
                <CardHeader>
                    <CardTitle>Platform Wallet Settings</CardTitle>
                    <CardDescription>This wallet receives the platform fees.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isFetching ? (
                        <p className='text-lg text-muted-foreground'>Loading</p>
                    ) : isError ? (
                        <p className='text-lg text-muted-foreground'>Not initialized</p>
                    ) : (
                        <p className='text-sm sm:text-lg font-mono bg-muted p-3 rounded-md break-all'>
                            {platformData?.platform_signer.toString()}
                        </p>
                    )}
                    <form
                        onSubmit={async (event) => {
                            event.preventDefault();
                            await updatePlatform(new web3.PublicKey(newPlatform));
                            refetch();
                            toast({
                                title: 'Success',
                                description: 'Do not forget to update the signer key!',
                                variant: 'destructive',
                            });
                        }}
                        className='mt-6 space-y-4'
                    >
                        <div>
                            <label
                                htmlFor='newWalletAddress'
                                className='block text-sm font-medium text-foreground mb-1'
                            >
                                Update Wallet Address
                            </label>
                            <Input
                                id='newWalletAddress'
                                type='text'
                                placeholder='Enter new Solana wallet address'
                                value={newPlatform}
                                onChange={(e) => setNewPlatform(e.target.value)}
                                required
                                className='text-base'
                            />
                        </div>
                        <Button
                            type='submit'
                            disabled={
                                isProcessing ||
                                newPlatform == platformData?.platform_signer.toString()
                            }
                        >
                            {isProcessing && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Update Wallet
                        </Button>
                    </form>
                </CardContent>
            </Card>
            <Card className='mt-6'>
                <CardContent>
                    <CardHeader className='px-0'>
                        <CardTitle>Withdraw Commission</CardTitle>{' '}
                        <CardDescription>Withdraw funds from platform</CardDescription>
                    </CardHeader>
                    {isFetching ? (
                        <p className='text-lg text-muted-foreground'>Loading</p>
                    ) : isError ? (
                        <p className='text-lg text-muted-foreground'>Not initialized</p>
                    ) : (
                        <p className='text-sm sm:text-lg font-mono bg-muted p-3 rounded-md break-all'>
                            {(platformData?.balance.toNumber() / LAMPORTS_PER_SOL).toFixed(4)}
                        </p>
                    )}
                    <Button
                        className='mt-6'
                        disabled={isProcessing}
                        onClick={async () => {
                            await withdrawCommission();
                            refetch();
                        }}
                    >
                        {isProcessing && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                        Withdraw
                    </Button>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
