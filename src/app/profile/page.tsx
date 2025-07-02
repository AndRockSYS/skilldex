'use client';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { UserCog, Volume2, Bell, Mail, Save, Loader2 } from 'lucide-react';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { ProfileSettings, profileSettingsSchema } from '@/lib/zod';
import { LOCAL_KEY_SETTING } from '@/utils/constants';

export default function ProfilePage() {
    const { publicKey } = useWallet();
    const { toast } = useToast();

    const [isSaving, setIsSaving] = useState(false);

    const form = useForm<ProfileSettings>({
        resolver: zodResolver(profileSettingsSchema),
        defaultValues: {
            enableGameSounds: true,
            enableBrowserNotifications: true,
            emailForNotifications: '',
        },
    });

    useEffect(() => {
        // todo save email inside of the database
        const savedSettings = localStorage.getItem(LOCAL_KEY_SETTING);
        if (savedSettings) {
            try {
                const parsedSettings = JSON.parse(savedSettings) as ProfileSettings;
                form.reset(parsedSettings);
            } catch (error) {
                toast({
                    title: 'Error',
                    description: 'Could not load saved settings.',
                    variant: 'destructive',
                });
            }
        }
    }, [form, toast]);

    const onSubmit = async (data: ProfileSettings) => {
        if (!publicKey) {
            toast({
                title: 'Wallet Not Connected',
                description: 'Please connect your wallet to save settings.',
                variant: 'destructive',
            });
            return;
        }
        setIsSaving(true);

        // todo save user data with firebase
        // TODO: Implement actual backend call to save settings

        setTimeout(() => {
            // Simulate API call delay
            toast({
                title: 'Settings Saved',
                description: 'Your profile preferences have been updated locally.',
            });
            setIsSaving(false);
        }, 1000);
    };

    if (!publicKey) {
        return (
            <div className='flex flex-col items-center justify-center min-h-[50vh] text-center p-4'>
                <UserCog className='h-16 w-16 text-primary mb-6' />
                <h1 className='text-2xl font-bold mb-2'>Connect Your Wallet</h1>
                <p className='text-muted-foreground mb-6 max-w-md'>
                    Please connect your wallet to access and manage your profile settings. Your
                    preferences are linked to your wallet address.
                </p>
            </div>
        );
    }

    return (
        <div className='max-w-2xl mx-auto py-8 px-4 sm:px-0'>
            <Card className='shadow-xl'>
                <CardHeader className='text-center border-b pb-6'>
                    <UserCog className='mx-auto h-12 w-12 text-primary mb-3' />
                    <CardTitle className='font-headline text-3xl'>
                        <span className='rainbow-text'>Profile Settings</span>
                    </CardTitle>
                    <CardDescription>
                        Manage your SKILLDEX.IO preferences here. Settings are saved locally per
                        wallet.
                    </CardDescription>
                </CardHeader>
                <CardContent className='pt-8'>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                            <FormField
                                control={form.control}
                                name='enableGameSounds'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-base flex items-center'>
                                                <Volume2 className='mr-2 h-5 w-5 text-primary' />
                                                Enable Game Sounds
                                            </FormLabel>
                                            <FormDescription>
                                                Toggle sound effects within games and UI
                                                interactions.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='enableBrowserNotifications'
                                render={({ field }) => (
                                    <FormItem className='flex flex-row items-center justify-between rounded-lg border p-4 shadow-sm bg-card'>
                                        <div className='space-y-0.5'>
                                            <FormLabel className='text-base flex items-center'>
                                                <Bell className='mr-2 h-5 w-5 text-primary' />
                                                Enable Browser Notifications
                                            </FormLabel>
                                            <FormDescription>
                                                Receive browser pop-ups for your turn, game events,
                                                etc.
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='emailForNotifications'
                                render={({ field }) => (
                                    <FormItem className='rounded-lg border p-4 shadow-sm bg-card'>
                                        <FormLabel className='text-base flex items-center'>
                                            <Mail className='mr-2 h-5 w-5 text-primary' />
                                            Email for Notifications
                                        </FormLabel>
                                        <FormControl>
                                            <Input
                                                type='email'
                                                placeholder='your@email.com'
                                                {...field}
                                            />
                                        </FormControl>
                                        <FormDescription>
                                            Enter your email to receive game updates and important
                                            alerts. (Note: Email notifications are not yet active
                                            but coming soon!)
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <Button
                                type='submit'
                                className='w-full text-lg py-3'
                                disabled={isSaving}
                            >
                                {isSaving ? (
                                    <Loader2 className='mr-2 h-5 w-5 animate-spin' />
                                ) : (
                                    <Save className='mr-2 h-5 w-5' />
                                )}
                                {isSaving ? 'Saving...' : 'Save Settings'}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>
        </div>
    );
}
