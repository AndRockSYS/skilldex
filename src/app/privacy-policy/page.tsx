import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPolicyPage() {
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
                        <span className='rainbow-text'>Privacy Policy</span>
                    </CardTitle>
                </CardHeader>
                <CardContent className='space-y-4 prose dark:prose-invert max-w-none text-sm sm:text-base'>
                    <p>
                        Your privacy is important to us. It is SKILLDEX.IO's policy to respect your
                        privacy regarding any information we may collect from you across our
                        website, skilldex.io, and other sites we own and operate.
                    </p>

                    <h2>1. Information We Collect</h2>
                    <h3>Log Data</h3>
                    <p>
                        When you visit our website, our servers may automatically log the standard
                        data provided by your web browser. It may include your computer’s Internet
                        Protocol (IP) address, your browser type and version, the pages you visit,
                        the time and date of your visit, the time spent on each page, and other
                        details.
                    </p>
                    <h3>Device Data</h3>
                    <p>
                        We may also collect data about the device you’re using to access our
                        website. This data may include the device type, operating system, unique
                        device identifiers, device settings, and geo-location data. What we collect
                        can depend on the individual settings of your device and software. We
                        recommend checking the policies of your device manufacturer or software
                        provider to learn what information they make available to us.
                    </p>
                    <h3>Wallet Information</h3>
                    <p>
                        When you connect your Solana wallet to our platform, we collect your public
                        wallet address to facilitate gameplay and transactions. We do not collect or
                        store your private keys.
                    </p>
                    <h3>Usage Data</h3>
                    <p>
                        We may collect information about your activity on our platform, such as
                        games played, challenges created or joined, and transaction history related
                        to platform usage. This data is used to improve our services and user
                        experience.
                    </p>
                    <h3>Local Storage</h3>
                    <p>
                        We use browser local storage to enhance user experience, for example, to
                        remember if you have dismissed the welcome modal. This data is stored on
                        your device and is not transmitted to our servers unless necessary for a
                        specific feature.
                    </p>

                    <h2>2. Legal Bases for Processing</h2>
                    <p>
                        We will process your personal information lawfully, fairly and in a
                        transparent manner. We collect and process information about you only where
                        we have legal bases for doing so.
                    </p>
                    <p>
                        These legal bases depend on the services you use and how you use them,
                        meaning we collect and use your information only where:
                    </p>
                    <ul>
                        <li>
                            It’s necessary for the performance of a contract to which you are a
                            party or to take steps at your request before entering into such a
                            contract (for example, when we provide a service you request from us);
                        </li>
                        <li>
                            It satisfies a legitimate interest (which is not overridden by your data
                            protection interests), such as for research and development, to market
                            and promote our services, and to protect our legal rights and interests;
                        </li>
                        <li>
                            You give us consent to do so for a specific purpose (for example, you
                            might consent to us sending you our newsletter); or
                        </li>
                        <li>We need to process your data to comply with a legal obligation.</li>
                    </ul>

                    <h2>3. Use of Information</h2>
                    <p>
                        We may use a combination of personally identifiable and non-personally
                        identifiable information collected through the Service to:
                    </p>
                    <ul>
                        <li>Operate and maintain the Service;</li>
                        <li>Provide you with customer support;</li>
                        <li>Monitor and improve the Service;</li>
                        <li>Comply with legal and regulatory requirements;</li>
                        <li>
                            Send you promotional information, such as newsletters, if you have
                            opted-in. You can opt-out of receiving promotional communications at any
                            time.
                        </li>
                    </ul>

                    <h2>4. Security of Your Personal Information</h2>
                    <p>
                        We will protect personal information by reasonable security safeguards
                        against loss or theft, as well as unauthorized access, disclosure, copying,
                        use or modification. However, we advise that no method of electronic
                        transmission or storage is 100% secure, and cannot guarantee the absolute
                        security of your data.
                    </p>

                    <h2>5. Data Retention</h2>
                    <p>
                        We retain your personal information only for as long as necessary to provide
                        our services and fulfill the purposes outlined in this policy. When your
                        personal information is no longer needed, we will securely delete or
                        anonymize it.
                    </p>

                    <h2>6. Children’s Privacy</h2>
                    <p>
                        Our Service does not address anyone under the age of 18 ("Children"). We do
                        not knowingly collect personally identifiable information from children
                        under 18. If you are a parent or guardian and you are aware that your child
                        has provided us with Personal Information, please contact us. If we become
                        aware that we have collected Personal Information from a child under age 18
                        without verification of parental consent, we take steps to remove that
                        information from our servers.
                    </p>

                    <h2>7. Links to Other Sites</h2>
                    <p>
                        Our website may link to external sites that are not operated by us. Please
                        be aware that we have no control over the content and policies of those
                        sites, and cannot accept responsibility or liability for their respective
                        privacy practices.
                    </p>

                    <h2>8. Changes to This Privacy Policy</h2>
                    <p>
                        We may update our Privacy Policy from time to time. We will notify you of
                        any changes by posting the new Privacy Policy on this page. You are advised
                        to review this Privacy Policy periodically for any changes. Changes to this
                        Privacy Policy are effective when they are posted on this page.
                    </p>

                    <h2>9. Your Rights</h2>
                    <p>
                        You have the right to be informed about how your personal data is used, to
                        access your personal data, to have incorrect data rectified, to have your
                        data erased, to restrict or object to processing, and to data portability.
                        For any requests or queries regarding your data, please contact us.
                    </p>

                    <h2>10. Contact Us</h2>
                    <p>
                        If you have any questions about this Privacy Policy, please contact us at
                        [Your Contact Email/Link].
                    </p>

                    <p className='mt-6 text-xs sm:text-sm'>
                        Last updated: {new Date().toLocaleDateString()}.
                    </p>
                </CardContent>
            </Card>
        </div>
    );
}
