'use client';

import Link from 'next/link';
import { FileText, ShieldCheck, Scale } from 'lucide-react';

export default function Footer() {
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
                </div>
                <div>
                    © {new Date().getFullYear()} SKILLDEX.IO. All rights reserved. Solana Edition.
                </div>
            </div>
        </footer>
    );
}
