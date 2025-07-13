import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Coins, Percent, Info } from 'lucide-react';

import { PLATFORM_COMMISSION } from '@/utils/constants';

export default function FeesPage() {
    return (
        <div className='container mx-auto max-w-3xl py-8 px-4'>
            <Button variant='outline' asChild className='mb-6 print:hidden'>
                <Link href='/'>
                    <ArrowLeft className='mr-2 h-4 w-4' /> Back to Home
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl sm:text-3xl font-headline flex items-center'>
                        <Percent className='mr-2 sm:mr-3 h-7 w-7 sm:h-8 sm:w-8 text-primary' />{' '}
                        <span className='rainbow-text'>Fee Structure</span>
                    </CardTitle>
                    <CardDescription>
                        Understanding the costs associated with playing on SKILLDEX.IO.
                    </CardDescription>
                </CardHeader>
                <CardContent className='space-y-6 text-sm sm:text-base'>
                    <section>
                        <h2 className='text-lg sm:text-xl font-semibold mb-2 flex items-center'>
                            <Coins className='mr-2 h-5 w-5 text-yellow-500' /> Platform Fee
                        </h2>
                        <p className='text-muted-foreground'>
                            SKILLDEX.IO charges a small platform fee to cover operational costs,
                            development, and to ensure the continuous improvement of our gaming
                            experience.
                        </p>
                        <div className='mt-4 p-3 sm:p-4 bg-muted/50 rounded-lg'>
                            <p className='text-base sm:text-lg font-semibold'>
                                Current Platform Fee:{' '}
                                <span className='text-primary'>{PLATFORM_COMMISSION}%</span> of the
                                total prize pool.
                            </p>
                            <p className='text-xs sm:text-sm text-muted-foreground mt-1'>
                                For example, if two players each stake 1 SOL (total prize pool of 2
                                SOL), the platform fee would be {PLATFORM_COMMISSION}% of 2 SOL,
                                which is {((2 * PLATFORM_COMMISSION) / 100).toFixed(4)} SOL. The
                                winner would then receive{' '}
                                {(2 - (2 * PLATFORM_COMMISSION) / 100).toFixed(4)} SOL.
                            </p>
                        </div>
                        <p className='text-xs sm:text-sm text-muted-foreground mt-4'>
                            This fee is automatically deducted from the total prize pool before it
                            is distributed to the winner of a challenge.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-lg sm:text-xl font-semibold mb-2 flex items-center'>
                            <Info className='mr-2 h-5 w-5 text-blue-500' /> Solana Network Fees (Gas
                            Fees)
                        </h2>
                        <p className='text-muted-foreground'>
                            In addition to our platform fee, all transactions on the Solana
                            blockchain incur network fees, often referred to as "gas fees". These
                            fees are not collected by SKILLDEX.IO but are paid to the Solana network
                            validators for processing transactions.
                        </p>
                        <ul className='list-disc list-inside text-muted-foreground space-y-1 pl-4 mt-2'>
                            <li>Creating a challenge involves a transaction.</li>
                            <li>Joining a challenge involves a transaction.</li>
                            <li>
                                Claiming winnings (if manual, though we aim for automatic transfers)
                                might involve a transaction.
                            </li>
                        </ul>
                        <p className='text-xs sm:text-sm text-muted-foreground mt-2'>
                            Solana is known for its low transaction fees, but they can vary based on
                            network congestion. Your connected wallet will always show you an
                            estimate of these network fees before you confirm any transaction.
                        </p>
                    </section>

                    <section>
                        <h2 className='text-lg sm:text-xl font-semibold mb-2'>Transparency</h2>
                        <p className='text-muted-foreground'>We believe in full transparency.</p>
                        <ul className='list-disc list-inside text-muted-foreground space-y-1 pl-4 mt-2'>
                            <li>The platform fee percentage is clearly stated.</li>
                            <li>
                                The net prize for the winner, after the platform fee, is displayed
                                when creating or viewing a challenge.
                            </li>
                            <li>
                                Your wallet will always prompt you to confirm any blockchain
                                transaction, showing estimated network fees.
                            </li>
                        </ul>
                    </section>

                    <section>
                        <h2 className='text-lg sm:text-xl font-semibold mb-2'>Questions?</h2>
                        <p className='text-muted-foreground'>
                            If you have any questions about our fees, please don't hesitate to{' '}
                            <Link href='/contact' className='text-primary hover:underline'>
                                contact us
                            </Link>{' '}
                            (assuming a contact page or method).
                        </p>
                    </section>
                    <p className='mt-6 text-xs sm:text-sm text-muted-foreground'>
                        Fee structure is subject to change. Last updated:{' '}
                        {new Date().toLocaleDateString()}.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
