'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';

import { useQuery } from '@tanstack/react-query';
import { useCallback, useState } from 'react';

import { getPlatformWallet } from '@/lib/solana';

export default function Settings() {
    const { data: platformWallet } = useQuery({
        queryKey: ['admin', 'wallet'],
        queryFn: async () => await getPlatformWallet(),
    });

    // todo rewrite form with the hook

    const [newPlatform, setNewPlatform] = useState<string>();
    const [isProcessing, setIsProcessing] = useState(false);
    const handleUpdatePlatform = useCallback(() => {
        // todo add wallet updaing
    }, []);

    return (
        <TabsContent value='settings' className='mt-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Platform Wallet Settings</CardTitle>
                    <CardDescription>This wallet receives the platform fees.</CardDescription>
                </CardHeader>
                <CardContent>
                    {platformWallet ? (
                        <p className='text-sm sm:text-lg font-mono bg-muted p-3 rounded-md break-all'>
                            {platformWallet}
                        </p>
                    ) : (
                        <p className='text-lg text-muted-foreground'>Not set.</p>
                    )}
                    <form onSubmit={handleUpdatePlatform} className='mt-6 space-y-4'>
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
                            disabled={isProcessing || newPlatform == platformWallet}
                        >
                            {isProcessing && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}
                            Update Wallet
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
