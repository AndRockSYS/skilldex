'use client';

import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletError, WalletConnectionError } from '@solana/wallet-adapter-base';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';

import { useRouter } from 'next/navigation';
import { useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

import { endpoint, wallets } from '@/config/solana';

export default function SolanaWalletProvider({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    const router = useRouter();
    const { toast } = useToast();

    const handleWalletError = useCallback(
        (error: WalletError) => {
            if (
                error instanceof WalletConnectionError &&
                (error.message.toLowerCase().includes('user rejected the request') ||
                    error.name === 'WalletConnectionError')
            ) {
                toast({
                    title: 'Connection Cancelled',
                    description: 'You cancelled the wallet connection. Redirecting.',
                    variant: 'default',
                    duration: 3000,
                });
                router.push('/');
            }
        },
        [router, toast]
    );

    return (
        <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect={true} onError={handleWalletError}>
                <WalletModalProvider>{children}</WalletModalProvider>
            </WalletProvider>
        </ConnectionProvider>
    );
}
