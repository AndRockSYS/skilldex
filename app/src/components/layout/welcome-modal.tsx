'use client';

import Link from 'next/link';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Gamepad2, Users, ShieldCheck, Zap, FileText, Scale } from 'lucide-react';

import { useState, useEffect } from 'react';

import { PLATFORM_COMMISSION, LOCAL_KEY_MODAL } from '@/utils/constants';

export default function WelcomeModal() {
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const dismissed = localStorage.getItem(LOCAL_KEY_MODAL);
            if (!dismissed) setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        if (typeof window !== 'undefined') localStorage.setItem(LOCAL_KEY_MODAL, 'true');
        setIsOpen(false);
    };

    if (!isOpen) return null;

    return (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
            <AlertDialogContent className='max-w-lg'>
                <AlertDialogHeader>
                    <div className='flex items-center justify-center mb-4'>
                        <Zap className='h-12 w-12 text-primary' />
                    </div>
                    <AlertDialogTitle className='text-2xl font-headline text-center'>
                        Welcome to SKILLDEX.IO!
                    </AlertDialogTitle>
                    <AlertDialogDescription className='text-center text-base text-muted-foreground px-4'>
                        Challenge players, showcase your skills, and win crypto prizes on the Solana
                        blockchain.
                    </AlertDialogDescription>
                </AlertDialogHeader>

                <div className='my-6 space-y-4 px-2 text-sm'>
                    <h3 className='font-semibold text-lg text-foreground mb-2 text-center'>
                        How It Works:
                    </h3>
                    <div className='flex items-start space-x-3'>
                        <Users className='h-5 w-5 text-primary mt-1 shrink-0' />
                        <div>
                            <span className='font-medium text-foreground'>Connect Wallet:</span>{' '}
                            Securely connect your Solana wallet. This is your key to the game.
                        </div>
                    </div>
                    <div className='flex items-start space-x-3'>
                        <Gamepad2 className='h-5 w-5 text-primary mt-1 shrink-0' />
                        <div>
                            <span className='font-medium text-foreground'>Challenge:</span> Create a
                            new game challenge or join an existing one from the lobby.
                        </div>
                    </div>
                    <div className='flex items-start space-x-3'>
                        <ShieldCheck className='h-5 w-5 text-primary mt-1 shrink-0' />
                        <div>
                            <span className='font-medium text-foreground'>Play & Win:</span> Compete
                            in skill-based games. Winners automatically receive the prize pool
                            (minus a small platform fee of {PLATFORM_COMMISSION}%) to their wallet.
                        </div>
                    </div>
                </div>

                <div className='text-xs text-muted-foreground text-center mb-2 px-4'>
                    By clicking "Accept & Play", you confirm that you are at least 18 years old and
                    agree to our:
                </div>
                <div className='flex justify-center items-center space-x-3 text-xs mb-6'>
                    <Link
                        href='/terms-of-use'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:underline flex items-center gap-1'
                    >
                        <FileText size={14} /> Terms of Use
                    </Link>
                    <span className='text-muted-foreground'>|</span>
                    <Link
                        href='/privacy-policy'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:underline flex items-center gap-1'
                    >
                        <ShieldCheck size={14} /> Privacy Policy
                    </Link>
                    <span className='text-muted-foreground'>|</span>
                    <Link
                        href='/fees'
                        target='_blank'
                        rel='noopener noreferrer'
                        className='text-primary hover:underline flex items-center gap-1'
                    >
                        <Scale size={14} /> Fees
                    </Link>
                </div>

                <AlertDialogFooter className='sm:justify-center'>
                    <AlertDialogAction
                        onClick={handleAccept}
                        className='w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground text-lg py-3 px-6'
                    >
                        Accept & Play
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
