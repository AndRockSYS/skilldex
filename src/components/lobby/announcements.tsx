'use client';

import { Button } from '@/components/ui/button';
import { Megaphone, X } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';

import { LOCAL_KEY_ANNOUNCEMENT_TIMESTAMP } from '@/utils/constants';

import AppDatabase from '@/lib/firebase/client';

export default function Announcements() {
    const { toast } = useToast();

    const { data: announcements } = useQuery({
        queryKey: ['announcement'],
        queryFn: async () => await AppDatabase.fetchAnnouncements(),
        throwOnError: (error) => {
            toast({
                title: 'Announcements Error',
                description: error.message,
                variant: 'destructive',
            });
            throw error;
        },
        initialData: [],
    });

    return announcements
        .filter(
            (ann) =>
                ann.timestamp.toMillis() >
                Number(localStorage.getItem(LOCAL_KEY_ANNOUNCEMENT_TIMESTAMP) ?? 0)
        )
        .map((announcement) => (
            <Alert
                key={announcement.timestamp.toString()}
                className='relative bg-primary/10 border-primary/30'
            >
                <Megaphone className='h-5 w-5 text-primary' />
                <AlertTitle className='font-headline text-primary'>{announcement.title}</AlertTitle>
                <AlertDescription className='text-primary/80 whitespace-pre-wrap'>
                    {announcement.content}
                </AlertDescription>
                <Button
                    variant='ghost'
                    size='icon'
                    className='absolute top-2 right-2 h-6 w-6 text-primary/70 hover:text-primary'
                    onClick={() =>
                        localStorage.setItem(
                            LOCAL_KEY_ANNOUNCEMENT_TIMESTAMP,
                            announcement.timestamp.toMillis().toString()
                        )
                    }
                    title='Dismiss announcement'
                >
                    <X className='h-4 w-4' />
                    <span className='sr-only'>Dismiss</span>
                </Button>
            </Alert>
        ));
}
