'use client';

import Link from 'next/link';
import { FileText, ShieldCheck, Scale, User } from 'lucide-react';

import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from '@tanstack/react-query';
import useProgram from '@/hooks/use-program';
import { usePathname } from 'next/navigation';

export default function Footer() {
    const pathname = usePathname();

    const { publicKey } = useWallet();

    const { fetchPlatformData } = useProgram();

    const { data: platformData } = useQuery({
        queryKey: ['admin', 'platform'],
        queryFn: async () => await fetchPlatformData(),
    });

    if (pathname == '/') return <></>;

    return (
        <footer className='py-6 text-center text-muted-foreground text-xs sm:text-sm border-t bg-background z-10'>
            <div className='container mx-auto px-4'>
                <div className='flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4 mb-2'>
                    <Link
                        href='/terms-of-use'
                        className='hover:text-primary transition-colors flex items-center gap-1'
                    >
                        <FileText size={14} /> Terms of Use
                    </Link>
                    <span className='hidden sm:inline'>|</span>
                    <Link
                        href='/privacy-policy'
                        className='hover:text-primary transition-colors flex items-center gap-1'
                    >
                        <ShieldCheck size={14} /> Privacy Policy
                    </Link>
                    <span className='hidden sm:inline'>|</span>
                    <Link
                        href='/fees'
                        className='hover:text-primary transition-colors flex items-center gap-1'
                    >
                        <Scale size={14} /> Fees
                    </Link>
                    {platformData?.platform_signer.toString() == publicKey?.toString() && (
                        <Link
                            href='/fees'
                            className='hover:text-primary transition-colors flex items-center gap-1'
                        >
                            <User size={14} /> Admin
                        </Link>
                    )}
                </div>
                <div>
                    © {new Date().getFullYear()} SKILLDEX.IO. All rights reserved. Solana Edition.
                </div>
            </div>
        </footer>
    );
}
