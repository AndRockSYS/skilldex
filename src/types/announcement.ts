import { Timestamp } from 'firebase/firestore';

export interface Announcement {
    title: string;
    content: string;
    timestamp: Timestamp;
}
