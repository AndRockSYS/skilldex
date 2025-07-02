'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
    ShieldCheck,
    BarChart3,
    LogOut,
    KeyRound,
    Loader2,
    UserCog,
    Flag,
    Megaphone,
    Settings,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Statistics from '@/components/admin/statistics';
import Moderation from '@/components/admin/moderation';
import FlaggedGames from '@/components/admin/flagged-games';
import Announcements from '@/components/lobby/announcements';

import { useState, useMemo, useCallback } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

import { verifyAdminPassword } from '@/actions/admin';

import { AdminPageData } from '@/types/admin';

export default function AdminPage() {
    const { toast } = useToast();
    const queryClient = useQueryClient();

    const isAuthed = useMemo(() => !!sessionStorage.getItem('isAdmin'), [sessionStorage]);
    const [actionPassword, setActionPassword] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [isLogging, setIsLogging] = useState(false);

    const {
        data: adminData,
        error,
        isFetching: isPageLoading,
    } = useQuery({
        queryKey: ['admin'],
        queryFn: async () => {
            // todo fetch all the data
            return {} as AdminPageData;
        },
        enabled: isAuthed,
    });

    const handleLogin = useCallback(async (event: React.FormEvent) => {
        event.preventDefault();

        setIsLogging(true);
        const result = await verifyAdminPassword(loginPassword);
        if (result.success) sessionStorage.setItem('isAdminAuthenticated', 'true');
        else
            toast({
                title: 'Authentication Failed',
                description: 'Invalid password.',
                variant: 'destructive',
            });

        setIsLogging(false);
    }, []);

    const handleLogout = useCallback(() => {
        sessionStorage.removeItem('isAdminAuthenticated');
        queryClient.removeQueries({ queryKey: ['admin'] });
        toast({ title: 'Logged Out', description: 'You have been logged out of the admin panel.' });
    }, [queryClient]);

    if (!isAuthed) {
        return (
            <div className='flex flex-col items-center justify-center min-h-screen p-4'>
                <Card className='w-full max-w-md shadow-xl'>
                    <CardHeader className='text-center'>
                        <KeyRound className='mx-auto h-10 w-10 sm:h-12 sm:w-12 text-primary mb-2' />
                        <CardTitle className='font-headline text-2xl sm:text-3xl'>
                            Admin Access
                        </CardTitle>
                        <CardDescription>
                            Enter the password to access the admin panel.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleLogin} className='space-y-4'>
                            <Input
                                type='password'
                                placeholder='Password'
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                                className='text-base'
                            />
                            {error && (
                                <p className='text-sm text-destructive text-center'>
                                    {error.message}
                                </p>
                            )}
                            <Button type='submit' className='w-full' disabled={isLogging}>
                                {isLogging ? (
                                    <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                ) : null}
                                Login
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        );
    }

    if (isPageLoading || !adminData) {
        return (
            <div className='flex justify-center items-center min-h-screen'>
                <Loader2 className='h-10 w-10 sm:h-12 sm:w-12 animate-spin text-primary' />
            </div>
        );
    }

    return (
        <div className='container mx-auto p-4 md:p-6 lg:p-8 space-y-8'>
            <div className='flex flex-col sm:flex-row justify-between items-center gap-4'>
                <h1 className='font-headline text-2xl sm:text-3xl md:text-4xl font-bold flex items-center'>
                    <ShieldCheck className='mr-2 sm:mr-3 h-8 w-8 sm:h-10 sm:w-10 text-primary' />{' '}
                    Admin Panel
                </h1>
                <Button variant='outline' onClick={handleLogout} className='w-full sm:w-auto'>
                    <LogOut className='mr-2 h-4 w-4' /> Logout
                </Button>
            </div>

            <Card className='mb-6'>
                <CardHeader>
                    <CardTitle>Admin Action Password</CardTitle>
                    <CardDescription>
                        Enter the admin password below to authorize sensitive actions on this page.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Input
                        type='password'
                        placeholder='Admin Password for Actions'
                        value={actionPassword}
                        onChange={(e) => setActionPassword(e.target.value)}
                        className='max-w-sm'
                    />
                </CardContent>
            </Card>

            <Tabs defaultValue='overview' className='w-full'>
                <TabsList className='grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-5'>
                    <TabsTrigger value='overview'>
                        <BarChart3 className='mr-2 h-4 w-4' />
                        Overview
                    </TabsTrigger>
                    <TabsTrigger value='moderation'>
                        <UserCog className='mr-2 h-4 w-4' />
                        User Moderation
                    </TabsTrigger>
                    <TabsTrigger value='flags'>
                        <Flag className='mr-2 h-4 w-4' />
                        Flagged Games
                    </TabsTrigger>
                    <TabsTrigger value='announcements'>
                        <Megaphone className='mr-2 h-4 w-4' />
                        Announcements
                    </TabsTrigger>
                    <TabsTrigger value='settings'>
                        <Settings className='mr-2 h-4 w-4' />
                        Platform Settings
                    </TabsTrigger>
                </TabsList>

                <Statistics stats={adminData.stats} />
                <Moderation moderationList={adminData.moderationList} />
                <FlaggedGames flaggedGames={adminData.flaggedGames} />
                <Announcements />
                <Settings />
            </Tabs>

            {!adminData && !isPageLoading && !error && (
                <Card>
                    <CardHeader>
                        <CardTitle>No Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>
                            Could not load admin data sections. Try refreshing or check console for
                            errors.
                        </p>
                    </CardContent>
                </Card>
            )}
            {error && (
                <Card className='border-destructive'>
                    <CardHeader>
                        <CardTitle className='text-destructive'>Error Loading Admin Data</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className='text-destructive'>{error.message}</p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
