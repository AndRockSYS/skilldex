'use client';

import Image from 'next/image';
import Link from 'next/link';
import { MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Props {
    text: string;
}

export default function ShareResult({ text }: Props) {
    const appUrl = typeof window !== 'undefined' ? window.location.origin : 'https://skilldex.io';
    const shareHashtags = 'SkilldexIo,SolanaGaming,P2P';

    const twitterShareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        text
    )}&url=${encodeURIComponent(appUrl)}&hashtags=${encodeURIComponent(shareHashtags)}`;
    const redditShareUrl = `https://www.reddit.com/submit?url=${encodeURIComponent(
        appUrl
    )}&title=${encodeURIComponent(text)}`;

    return (
        <div className='pt-4 border-t'>
            <p className='text-sm font-medium text-muted-foreground mb-3'>Share Your Result!</p>
            <div className='flex justify-center items-center gap-3 sm:gap-4'>
                <Button variant='outline' size='icon' asChild title='Share on Twitter/X'>
                    <Link href={twitterShareUrl} target='_blank' rel='noopener noreferrer'>
                        <Image
                            className='size-5'
                            src={'/icons/x.svg'}
                            alt='x'
                            width={20}
                            height={20}
                        />
                    </Link>
                </Button>
                <Button variant='outline' size='icon' asChild title='Share on Reddit'>
                    <Link href={redditShareUrl} target='_blank' rel='noopener noreferrer'>
                        <MessageSquare className='h-5 w-5' />
                    </Link>
                </Button>
                <Button variant='outline' size='icon' asChild title='Share on Instagram'>
                    <Link href='https://instagram.com' target='_blank' rel='noopener noreferrer'>
                        <Image
                            className='size-5'
                            src={'/icons/instagram.svg'}
                            alt='instagram'
                            width={20}
                            height={20}
                        />
                    </Link>
                </Button>
                <Button variant='outline' size='icon' asChild title='Share on TikTok'>
                    <Link href='https://tiktok.com' target='_blank' rel='noopener noreferrer'>
                        <Image
                            className='size-5'
                            src={'/icons/tiktok.svg'}
                            alt='tiktok'
                            width={20}
                            height={20}
                        />
                    </Link>
                </Button>
            </div>
            <p className='text-xs text-muted-foreground mt-3'>
                Tip: Take a screenshot of your game to share with your post!
            </p>
        </div>
    );
}
