import { useCallback, useEffect, useRef, useState } from 'react';
import { useToast } from '../use-toast';

export default function useNotifications() {
    const { toast } = useToast();

    const [notificationPermission, setNotificationPermission] =
        useState<NotificationPermission>('default');
    const soundRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (notificationPermission != 'default' || typeof window == 'undefined') return;

        Notification.requestPermission().then((permission) => {
            setNotificationPermission(permission);
            if (permission === 'denied')
                toast({
                    title: 'Notifications Blocked',
                    description: "You won't receive browser notifications for your turn.",
                    variant: 'default',
                    duration: 7000,
                });
            if (permission === 'granted')
                toast({
                    title: 'Notifications Enabled',
                    description: "You'll get a pop-up for your turn if the tab is inactive.",
                    variant: 'default',
                    duration: 5000,
                });
        });
    }, [notificationPermission]);

    const playTurnSound = useCallback(async () => {
        if (!soundRef.current) return;

        if (soundRef.current.readyState >= 2)
            await soundRef.current
                .play()
                .catch(() => console.warn('Notification sound play failed.'));
        else console.warn('Notification sound not ready to play.');
    }, []);

    return { notificationPermission, soundRef, playTurnSound };
}
