import * as z from 'zod';

import { MAX_STAKE, MIN_STAKE } from '@/utils/constants';

import { GameType, MatchFormat } from '@/types/games';
import { getTokenName, Token } from '@/types/utils';
import { ModerationAction } from '@/types/admin';

export const profileSettingsSchema = z.object({
    name: z
        .string()
        .max(20, 'Username must be 20 characters or less.')
        .optional()
        .or(z.literal('')),
    avatar: z.string().optional(),
    gameSound: z.boolean(),
    browser: z.boolean(),
    email: z.string().email({ message: 'Invalid email address' }).optional().or(z.literal('')),
});

export type ProfileSettings = z.infer<typeof profileSettingsSchema>;

export const lobbySchema = z
    .object({
        gameType: z.custom<GameType>(),
        token: z.custom<Token>(),
        stake: z.coerce.number(),
        expiration: z.number().min(1, 'Please select an expiration time'),
        turnTimeLimit: z.number().min(1, 'Please select a turn time limit'),
        matchFormat: z.custom<MatchFormat>(),
    })
    .refine(
        (data) => data.stake >= MIN_STAKE && data.stake <= MAX_STAKE,
        (data) => ({
            message: `Stake amount must be at least ${MIN_STAKE} ${getTokenName(
                data.token
            )} and less than ${MAX_STAKE} ${getTokenName(data.token)}`,
            path: ['stake'],
        })
    );

export type LobbyForm = z.infer<typeof lobbySchema>;

export const moderationForm = z.object({
    wallet: z.string(),
    action: z.custom<ModerationAction>(),
    reason: z.string().min(10, 'Describe the reason'),
});

export type ModerationForm = z.infer<typeof moderationForm>;
