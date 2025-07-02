'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Trash2 } from 'lucide-react';
import { TabsContent } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { useCallback, useState } from 'react';

import { AnnouncementEntry } from '@/types/admin';

interface Props {
    announcements: AnnouncementEntry[];
}

export default function Announcements({ announcements }: Props) {
    const [announcementTitle, setAnnouncementTitle] = useState('');
    const [announcementContent, setAnnouncementContent] = useState('');

    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleAnnouncementSubmit = useCallback(() => {}, []);

    const [isToggling, setIsToggling] = useState(false);
    const handleAnnouncementToggle = useCallback((id: string, isVisible: boolean) => {}, []);

    const [isDeleting, setIsDeleting] = useState(false);
    const handleDeleteAnnouncement = useCallback((id: string) => {}, []);

    return (
        <TabsContent value='announcements' className='mt-6'>
            <Card>
                <CardHeader>
                    <CardTitle>Platform Announcements</CardTitle>
                    <CardDescription>Create and manage announcements for users.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAnnouncementSubmit} className='space-y-4 mb-6'>
                        <Input
                            type='text'
                            placeholder='Announcement Title'
                            value={announcementTitle}
                            onChange={(e) => setAnnouncementTitle(e.target.value)}
                            required
                        />
                        <Textarea
                            placeholder='Announcement Content'
                            value={announcementContent}
                            onChange={(e) => setAnnouncementContent(e.target.value)}
                            required
                        />
                        <Button type='submit' disabled={isSubmitting}>
                            {isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />}{' '}
                            Create Announcement
                        </Button>
                    </form>
                    <h3 className='font-headline text-lg mb-2'>Existing Announcements</h3>
                    {!announcements.length && <p>No announcements yet.</p>}
                    <div className='space-y-2 max-h-96 overflow-y-auto'>
                        {announcements.map((ann) => (
                            <Card key={ann.id} className='p-3'>
                                <div className='flex justify-between items-start'>
                                    <div>
                                        <h4 className='font-semibold'>{ann.title}</h4>
                                        <p className='text-sm text-muted-foreground whitespace-pre-wrap'>
                                            {ann.content}
                                        </p>
                                        <p className='text-xs text-muted-foreground mt-1'>
                                            Created:{' '}
                                            {new Date(ann.createdAt.toMillis()).toLocaleString()}
                                        </p>
                                        {ann.updatedAt && (
                                            <p className='text-xs text-muted-foreground'>
                                                Updated:{' '}
                                                {new Date(
                                                    ann.updatedAt.toMillis()
                                                ).toLocaleString()}
                                            </p>
                                        )}
                                    </div>
                                    <div className='flex flex-col items-end gap-2 shrink-0 ml-2'>
                                        <div className='flex items-center space-x-2'>
                                            <Label
                                                htmlFor={`visible-${ann.id}`}
                                                className='text-xs'
                                            >
                                                {ann.isVisible ? 'Visible' : 'Hidden'}
                                            </Label>
                                            <Switch
                                                id={`visible-${ann.id}`}
                                                checked={ann.isVisible}
                                                onCheckedChange={() =>
                                                    handleAnnouncementToggle(ann.id, ann.isVisible)
                                                }
                                                disabled={isToggling}
                                            />
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button
                                                    variant='destructive'
                                                    size='icon'
                                                    className='h-7 w-7'
                                                    disabled={isDeleting}
                                                    title='Delete Announcement'
                                                >
                                                    <Trash2 className='h-4 w-4' />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>
                                                        Are you sure?
                                                    </AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will
                                                        permanently delete the announcement titled "
                                                        {ann.title}".
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() =>
                                                            handleDeleteAnnouncement(ann.id)
                                                        }
                                                        className='bg-destructive hover:bg-destructive/90'
                                                    >
                                                        Delete
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                </div>
                            </Card>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </TabsContent>
    );
}
