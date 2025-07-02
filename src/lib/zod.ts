import * as z from 'zod';

import { MAX_STAKE, MIN_STAKE } from '@/utils/constants';

import { GameType, MatchFormat } from '@/types/games';
import { getTokenName, Token } from '@/types/utils';

export const profileSettingsSchema = z.object({
    enableGameSounds: z.boolean().optional(),
    enableBrowserNotifications: z.boolean().optional(),
    emailForNotifications: z
        .string()
        .email({ message: 'Invalid email address' })
        .optional()
        .or(z.literal('')),
});

export type ProfileSettings = z.infer<typeof profileSettingsSchema>;

export const lobbySchema = z
    .object({
        gameType: z.custom<GameType>(),
        token: z.custom<Token>(),
        stake: z.coerce.number(),
        expiration: z.string().min(1, 'Please select an expiration time'),
        turnTimeLimit: z.string().min(1, 'Please select a turn time limit'),
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

export const generateTauntInput = z.object({
    gameName: z.string().describe('The name of the game for the challenge.'),
    stakeAmount: z.number().describe('The amount of tokens staked for the challenge.'),
    token: z.string().describe('The type of token being staked (e.g., SOL).'),
    creatorHandle: z
        .string()
        .optional()
        .describe('An optional handle or identifier for the challenge creator.'),
});

export type GenerateTauntInput = z.infer<typeof generateTauntInput>;

export const generateTauntOutput = z.object({
    tauntText: z
        .string()
        .describe(
            'The generated tweet-sized challenge taunt, including a {{CHALLENGE_LINK}} placeholder.'
        ),
});

export type GenerateTauntOutput = z.infer<typeof generateTauntOutput>;
