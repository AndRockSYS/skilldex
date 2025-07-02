'use server';

import { revalidatePath } from 'next/cache';

export async function verifyAdminPassword(password: string): Promise<{ success: boolean }> {
    // todo manage password in a better way
    return { success: password === process.env.ADMIN_PASSWORD };
}

export async function updatePlatformWallet(
    newWalletAddress: string,
    adminPassword?: string
): Promise<{ success: boolean; message: string }> {
    // todo add contract call
    if (!adminPassword || (await verifyAdminPassword(adminPassword)).success === false) {
        return { success: false, message: 'Admin authentication failed.' };
    }
    if (!newWalletAddress || newWalletAddress.trim() === '') {
        return { success: false, message: 'Wallet address cannot be empty.' };
    }
    if (newWalletAddress.length < 32 || newWalletAddress.length > 44) {
        return { success: false, message: 'Invalid Solana wallet address format.' };
    }
    console.log(`(Demo Mode) Pretending to update platform wallet to: ${newWalletAddress}`);
    revalidatePath('/admin');
    return { success: true, message: 'Platform wallet address updated successfully (Demo Mode).' };
}

export async function applyModerationAction(
    walletAddress: string,
    action: 'warn' | 'ban' | 'unban',
    reason: string,
    adminPassword?: string
): Promise<{ success: boolean; message: string }> {
    // todo add firebase action
    if (!adminPassword || (await verifyAdminPassword(adminPassword)).success === false) {
        return { success: false, message: 'Admin authentication failed.' };
    }
    if (!walletAddress || walletAddress.trim() === '') {
        return { success: false, message: 'Wallet address cannot be empty.' };
    }
    if (walletAddress.length < 32 || walletAddress.length > 44) {
        return {
            success: false,
            message: 'Invalid Solana wallet address format for moderation target.',
        };
    }
    if (!reason || reason.trim() === '') {
        return { success: false, message: 'Reason cannot be empty.' };
    }
    console.log(
        `(Demo Mode) Moderation action '${action}' for wallet '${walletAddress}' with reason: '${reason}'`
    );
    revalidatePath('/admin');
    return {
        success: true,
        message: `User ${walletAddress} status updated to ${action} (Demo Mode).`,
    };
}

export async function createPlatformAnnouncement(
    title: string,
    content: string,
    adminPassword?: string
): Promise<{ success: boolean; message: string; id?: string }> {
    // todo add firebase action
    if (!adminPassword || (await verifyAdminPassword(adminPassword)).success === false) {
        return { success: false, message: 'Admin authentication failed.' };
    }
    if (!title || title.trim() === '') {
        return { success: false, message: 'Announcement title cannot be empty.' };
    }
    if (!content || content.trim() === '') {
        return { success: false, message: 'Announcement content cannot be empty.' };
    }
    console.log(`(Demo Mode) Creating announcement: '${title}'`);
    revalidatePath('/admin');
    revalidatePath('/lobby');
    return {
        success: true,
        message: 'Announcement created successfully (Demo Mode).',
        id: `demo_anno_${Date.now()}`,
    };
}

export async function toggleAnnouncementVisibility(
    announcementId: string,
    newVisibility: boolean,
    adminPassword?: string
): Promise<{ success: boolean; message: string }> {
    // todo add firebase action
    if (!adminPassword || (await verifyAdminPassword(adminPassword)).success === false) {
        return { success: false, message: 'Admin authentication failed.' };
    }
    console.log(
        `(Demo Mode) Toggling announcement ${announcementId} visibility to ${newVisibility}`
    );
    revalidatePath('/admin');
    revalidatePath('/lobby');
    return { success: true, message: `Announcement visibility updated (Demo Mode).` };
}

export async function deletePlatformAnnouncement(
    announcementId: string,
    adminPassword?: string
): Promise<{ success: boolean; message: string }> {
    // todo add firebase action
    if (!adminPassword || (await verifyAdminPassword(adminPassword)).success === false) {
        return { success: false, message: 'Admin authentication failed.' };
    }
    console.log(`(Demo Mode) Deleting announcement ${announcementId}`);
    revalidatePath('/admin');
    revalidatePath('/lobby');
    return { success: true, message: 'Announcement deleted successfully (Demo Mode).' };
}

export async function resolveFlaggedGame(
    flagId: string,
    resolutionNotes: string,
    adminPassword?: string
): Promise<{ success: boolean; message: string }> {
    // todo add firebase action
    if (!adminPassword || (await verifyAdminPassword(adminPassword)).success === false) {
        return { success: false, message: 'Admin authentication failed.' };
    }
    if (!resolutionNotes || resolutionNotes.trim() === '') {
        return { success: false, message: 'Resolution notes cannot be empty.' };
    }
    console.log(`(Demo Mode) Resolving flag ${flagId} with notes: ${resolutionNotes}`);
    revalidatePath('/admin');
    return { success: true, message: `Flag ${flagId} marked as resolved (Demo Mode).` };
}
