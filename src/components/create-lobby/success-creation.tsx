'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from '@/components/ui/dialog';
import { Loader2, ThumbsUp, MessageSquareQuote, Copy, Share2, UserPlus } from 'lucide-react';

import { useCallback, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

import { generateChallengeTaunt } from '@/lib/ai/flows/generate-challenge-taunt-flow';

import { LAMPORTS_PER_SOL } from '@solana/web3.js';

import { getGameName, getMatchFormatName, Lobby } from '@/types/games';
import { getTokenName } from '@/types/utils';

export default function SuccessCreation({ lobby }: { lobby: Lobby }) {
    const { toast } = useToast();
    const router = useRouter();

    const lobbyLink = useMemo(
        () => `${process.env.BASE_URL}/lobby?lobbyId=${lobby.id}`,
        [lobby.id]
    );

    const [isTauntDialogOpen, setIsTauntDialogOpen] = useState(false);
    const [generatedTaunt, setGeneratedTaunt] = useState('');
    const [isGeneratingTaunt, setIsGeneratingTaunt] = useState(false);

    const handleGenerateTaunt = useCallback(async () => {
        setIsGeneratingTaunt(true);
        setGeneratedTaunt('');

        try {
            const result = await generateChallengeTaunt({
                gameName: getGameName(lobby.gameType),
                stakeAmount: lobby.pool.initial,
                token: getTokenName(lobby.pool.token),
                creatorHandle: lobby.creator.wallet.substring(0, 6) + '...',
            });

            const tauntText =
                result.tauntText.replace('{{CHALLENGE_LINK}}', lobbyLink) +
                getMatchFormatName(lobby.format);

            setGeneratedTaunt(tauntText);
            setIsTauntDialogOpen(true);
        } catch (error: any) {
            toast({
                title: 'Taunt Generation Failed',
                description: error.message || 'Could not generate taunt.',
                variant: 'destructive',
            });
        }

        setIsGeneratingTaunt(false);
    }, [lobby]);

    const handleCopyText = useCallback(async (text: string, message: string) => {
        try {
            await navigator.clipboard.writeText(text);
            toast({ title: message, description: 'Copied to clipboard.' });
        } catch (error) {
            toast({
                title: 'Copy Failed',
                description: 'Could not copy text.',
                variant: 'destructive',
            });
        }
    }, []);

    return (
        <div className='max-w-md mx-auto p-4 sm:p-0'>
            <Card className='shadow-xl text-center'>
                <CardHeader>
                    <ThumbsUp className='mx-auto h-12 w-12 text-green-500 mb-3' />
                    <CardTitle className='font-headline text-2xl'>Challenge Created!</CardTitle>
                    <CardDescription>
                        Your {getGameName(lobby.gameType)} challenge for{' '}
                        {(lobby.pool.initial / LAMPORTS_PER_SOL).toFixed(2)}{' '}
                        {getTokenName(lobby.pool.token)} {getMatchFormatName(lobby.format)} is live!
                    </CardDescription>
                    <p className='text-xs text-muted-foreground pt-1'>Lobby ID: {lobby.id}</p>
                </CardHeader>
                <CardContent className='space-y-4'>
                    <Card className='text-left p-4 bg-muted/50'>
                        <CardTitle className='text-lg font-semibold mb-2 flex items-center'>
                            <UserPlus className='mr-2 h-5 w-5 text-primary' /> Invite a Friend
                        </CardTitle>
                        <p className='text-sm text-muted-foreground mb-2'>
                            Share this link with your friend to invite them directly to your lobby:
                        </p>
                        <div className='flex items-center space-x-2'>
                            <Input
                                type='text'
                                readOnly
                                value={lobbyLink}
                                className='bg-background text-sm'
                            />
                            <Button
                                variant='outline'
                                size='icon'
                                onClick={() => handleCopyText(lobbyLink, 'Lobby Link Copied!')}
                                title='Copy lobby link'
                            >
                                <Copy className='h-4 w-4' />
                            </Button>
                        </div>
                    </Card>

                    <Button
                        onClick={handleGenerateTaunt}
                        className='w-full'
                        disabled={isGeneratingTaunt}
                    >
                        {isGeneratingTaunt ? (
                            <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                        ) : (
                            <MessageSquareQuote className='mr-2 h-5 w-5' />
                        )}
                        Generate Shareable Taunt
                    </Button>
                    <Button
                        variant='outline'
                        onClick={() => router.push('/lobby')}
                        className='w-full'
                    >
                        Go to Lobby
                    </Button>
                </CardContent>
            </Card>

            <Dialog open={isTauntDialogOpen} onOpenChange={setIsTauntDialogOpen}>
                <DialogContent className='sm:max-w-md'>
                    <DialogHeader>
                        <DialogTitle>Share Your Challenge!</DialogTitle>
                        <DialogDescription>
                            Copy this taunt or share it directly on X/Twitter.
                        </DialogDescription>
                    </DialogHeader>
                    <div className='my-4 p-3 bg-muted rounded-md text-sm'>
                        {generatedTaunt ? (
                            <p className='whitespace-pre-wrap'>{generatedTaunt}</p>
                        ) : (
                            <p>Generating taunt...</p>
                        )}
                    </div>
                    <DialogFooter className='gap-2 sm:gap-0 flex-col sm:flex-row'>
                        <Button
                            variant='outline'
                            onClick={() => handleCopyText(generatedTaunt, 'Taunt Copied!')}
                            disabled={!generatedTaunt}
                            className='w-full sm:w-auto'
                        >
                            <Copy className='mr-2 h-4 w-4' /> Copy Taunt
                        </Button>
                        <Button
                            onClick={() => {
                                const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
                                    generatedTaunt
                                )}`;
                                window.open(twitterUrl, '_blank', 'noopener,noreferrer');
                            }}
                            disabled={!generatedTaunt}
                            className='bg-[#1DA1F2] hover:bg-[#1DA1F2]/90 text-white w-full sm:w-auto'
                        >
                            <Share2 className='mr-2 h-4 w-4' /> Share on X
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
