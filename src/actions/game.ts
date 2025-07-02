'use server';

import { revalidatePath } from 'next/cache';

interface ReportGameOutput {
    success: boolean;
    message: string;
    flagId?: string;
}

export async function reportGameActivity(
    gameId: number,
    text: string,
    reporterWallet?: string
): Promise<ReportGameOutput> {
    if (!gameId) return { success: false, message: 'Game ID is required to submit a report.' };

    if (!text) return { success: false, message: 'A reason must be provided for the report.' };

    if (text.length > 1000)
        return { success: false, message: 'Report reason is too long (max 1000 characters).' };

    // todo send report

    revalidatePath('/admin');

    return {
        success: true,
        message: 'Game reported successfully (Demo Mode).',
        flagId: `demo_flag_${Date.now()}`,
    };
}
