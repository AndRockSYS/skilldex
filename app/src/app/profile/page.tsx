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
import { UserCog, Volume2, Bell, Mail, Save, Loader2, User, Camera } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { useWallet } from '@solana/wallet-adapter-react';
import { useState, useRef, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from '@/lib/redux/hooks';

import { zodResolver } from '@hookform/resolvers/zod';
import { ProfileSettings, profileSettingsSchema } from '@/lib/zod';
import { updateNotifications, updateUserAppeareance } from '@/lib/redux/slice/user';

export default function ProfilePage() {
    const user = useAppSelector((state) => state.userReducer);
    const dispatch = useAppDispatch();
    const { publicKey } = useWallet();

    const { toast } = useToast();
    const [isSaving, setIsSaving] = useState(false);
    const avatarInputRef = useRef<HTMLInputElement>(null);

    const form = useForm<ProfileSettings>({
        resolver: zodResolver(profileSettingsSchema),
        defaultValues: {
            avatar: '',
            name: '',
            gameSound: true,
            browser: true,
            email: '',
        },
    });
    const avatar = form.watch('avatar');

    useEffect(() => {
        if (user) {
            form.reset({
                avatar: user.avatar ?? '',
                name: user.name ?? '',
                gameSound: user.notifications?.gameSound ?? true,
                browser: user.notifications?.browser ?? true,
                email: user.notifications?.email ?? '',
            });
        }
    }, [user]);

    const onSubmit = async (data: ProfileSettings) => {
        try {
            if (!publicKey) {
                toast({
                    title: 'Wallet Not Connected',
                    description: 'Please connect your wallet to save settings.',
                    variant: 'destructive',
                });
                return;
            }
            setIsSaving(true);

            await dispatch(
                updateNotifications({
                    browser: data.browser,
                    gameSound: data.gameSound,
                    email: data.email,
                })
            );
            await dispatch(updateUserAppeareance({ name: data.name, avatar: data.avatar }));

            toast({
                title: 'Settings Saved',
                description: 'Your profile preferences have been updated.',
            });
        } catch (error) {
            toast({
                title: 'Settings Were Not Applied',
                description: 'An error occured during settings update.',
                variant: 'destructive',
            });
        } finally {
            setIsSaving(false);
        }
    };

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (file.size > 1024 * 1024) {
                toast({
                    title: 'Image Too Large',
                    description: 'Please select an image smaller than 1MB.',
                    variant: 'destructive',
                });
                return;
            }

            const reader = new FileReader();
            reader.onloadend = () => {
                const dataUrl = reader.result as string;
                form.setValue('avatar', dataUrl, { shouldDirty: true });
            };

            reader.readAsDataURL(file);
        }
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

    console.log(avatar);

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
                            <div className='flex flex-col items-center gap-4'>
                                <div className='relative'>
                                    <Avatar className='h-24 w-24 border-4 border-primary/50'>
                                        {avatar ? (
                                            <AvatarImage
                                                key={avatar}
                                                src={avatar}
                                                alt='User Avatar'
                                            />
                                        ) : (
                                            <AvatarFallback className='bg-muted'>
                                                <User className='h-12 w-12 text-muted-foreground' />
                                            </AvatarFallback>
                                        )}
                                    </Avatar>
                                    <Button
                                        type='button'
                                        variant='outline'
                                        size='icon'
                                        className='absolute bottom-0 right-0 rounded-full h-8 w-8 bg-background'
                                        onClick={() => avatarInputRef.current?.click()}
                                    >
                                        <Camera className='h-4 w-4' />
                                        <span className='sr-only'>Change avatar</span>
                                    </Button>
                                    <Input
                                        type='file'
                                        ref={avatarInputRef}
                                        className='hidden'
                                        accept='image/png, image/jpeg, image/gif'
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                            </div>

                            <FormField
                                control={form.control}
                                name='name'
                                render={({ field }) => (
                                    <FormItem className='rounded-lg border p-4 shadow-sm bg-card'>
                                        <FormLabel className='text-base flex items-center'>
                                            <User className='mr-2 h-5 w-5 text-primary' />
                                            User Name
                                        </FormLabel>
                                        <FormControl>
                                            <Input placeholder='Your username' {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            This name will be displayed on the leaderboard and in
                                            games.
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name='gameSound'
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
                                name='browser'
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
                                name='email'
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
