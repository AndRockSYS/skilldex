import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

import { PLATFORM_COMMISSION } from '@/utils/constants';

export default function TermsOfUsePage() {
    return (
        <div className='container mx-auto max-w-3xl py-8 px-4'>
            <Button variant='outline' asChild className='mb-6 print:hidden'>
                <Link href='/'>
                    <ArrowLeft className='mr-2 h-4 w-4' /> Back to Home
                </Link>
            </Button>
            <Card>
                <CardHeader>
                    <CardTitle className='text-2xl sm:text-3xl font-headline'>
                        <span className='rainbow-text'>Terms of Use</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 prose dark:prose-invert max-w-none text-sm sm:text-base'>
                    <p>
                        Welcome to SKILLDEX.IO! These terms and conditions outline the rules and
                        regulations for the use of SKILLDEX.IO's Website, located at skilldex.io.
                    </p>
                    <p>
                        By accessing this website we assume you accept these terms and conditions.
                        Do not continue to use SKILLDEX.IO if you do not agree to take all of the
                        terms and conditions stated on this page.
                    </p>

                    <h2>1. Definitions</h2>
                    <p>
                        The following terminology applies to these Terms and Conditions, Privacy
                        Statement and Disclaimer Notice and all Agreements: "Client", "You" and
                        "Your" refers to you, the person log on this website and compliant to the
                        Company’s terms and conditions. "The Company", "Ourselves", "We", "Our" and
                        "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the
                        Client and ourselves.{' '}
                    </p>

                    <h2>2. Eligibility</h2>
                    <p>
                        You must be at least 18 years of age to use our platform. By using
                        SKILLDEX.IO, you represent and warrant that you meet this age requirement
                        and are legally able to enter into a binding contract. Users are responsible
                        for ensuring their use of the platform complies with all local, national,
                        and international laws and regulations.
                    </p>

                    <h2>3. Account and Wallet</h2>
                    <p>
                        To use SKILLDEX.IO, you will need to connect a supported Solana
                        cryptocurrency wallet. You are solely responsible for the security of your
                        wallet and any activity that occurs under your wallet address. SKILLDEX.IO
                        does not have access to your private keys or funds.
                    </p>

                    <h2>4. Gameplay and Challenges</h2>
                    <p>
                        Users can create or join challenges by staking an agreed-upon amount of
                        cryptocurrency. The winner of a challenge receives the total staked amount
                        from both players, minus applicable platform fees. SKILLDEX.IO is not
                        responsible for any losses incurred due to gameplay, market fluctuations, or
                        user error.
                    </p>

                    <h2>5. Platform Fees</h2>
                    <p>
                        SKILLDEX.IO charges a platform fee for facilitating games. The current
                        platform fee is {PLATFORM_COMMISSION}% of the total stake for each game.
                        This fee is automatically deducted from the prize pool before distribution
                        to the winner. We reserve the right to change the platform fee at any time.
                        Any changes will be posted on our website or communicated to users.
                    </p>

                    <h2>6. Prohibited Activities</h2>
                    <p>You agree not to engage in any of the following prohibited activities:</p>
                    <ul>
                        <li>
                            Using any automated system, including without limitation "robots,"
                            "spiders," "offline readers," etc., to access the service in a manner
                            that sends more request messages to the SKILLDEX.IO servers than a human
                            can reasonably produce in the same period by using a conventional
                            on-line web browser.
                        </li>
                        <li>
                            Attempting to interfere with, compromise the system integrity or
                            security or decipher any transmissions to or from the servers running
                            the service.
                        </li>
                        <li>Engaging in any activity that is fraudulent, abusive, or illegal.</li>
                        <li>
                            Using the platform for any money laundering or other illicit financial
                            activities.
                        </li>
                    </ul>

                    <h2>7. Intellectual Property</h2>
                    <p>
                        The Service and its original content (excluding Content provided by users),
                        features and functionality are and will remain the exclusive property of
                        SKILLDEX.IO and its licensors.
                    </p>

                    <h2>8. Limitation of Liability</h2>
                    <p>
                        In no event shall SKILLDEX.IO, nor its directors, employees, partners,
                        agents, suppliers, or affiliates, be liable for any indirect, incidental,
                        special, consequential or punitive damages, including without limitation,
                        loss of profits, data, use, goodwill, or other intangible losses, resulting
                        from your access to or use of or inability to access or use the Service.
                    </p>

                    <h2>9. Disclaimer</h2>
                    <p>
                        Your use of the Service is at your sole risk. The Service is provided on an
                        "AS IS" and "AS AVAILABLE" basis. The Service is provided without warranties
                        of any kind, whether express or implied, including, but not limited to,
                        implied warranties of merchantability, fitness for a particular purpose,
                        non-infringement or course of performance.
                    </p>
                    <p>
                        SKILLDEX.IO does not warrant that a) the Service will function
                        uninterrupted, secure or available at any particular time or location; b)
                        any errors or defects will be corrected; c) the Service is free of viruses
                        or other harmful components; or d) the results of using the Service will
                        meet your requirements.
                    </p>

                    <h2>10. Governing Law</h2>
                    <p>
                        These Terms shall be governed and construed in accordance with the laws of
                        [Your Jurisdiction], without regard to its conflict of law provisions.
                    </p>

                    <h2>11. Changes to Terms</h2>
                    <p>
                        We reserve the right, at our sole discretion, to modify or replace these
                        Terms at any time. If a revision is material we will try to provide at least
                        30 days' notice prior to any new terms taking effect. What constitutes a
                        material change will be determined at our sole discretion.
                    </p>

                    <h2>12. Contact Us</h2>
                    <p>
                        If you have any questions about these Terms, please contact us at [Your
                        Contact Email/Link].
                    </p>

                    <p className='mt-6 text-xs sm:text-sm'>
                        Last updated: {new Date().toLocaleDateString()}.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
