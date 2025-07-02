'use server';

/**
 * @fileOverview This file defines the auto-play game flow using Genkit.
 *
 * - autoPlayGame - A function that initiates the auto-play game flow.
 * - AutoPlayGameInput - The input type for the autoPlayGame function.
 * - AutoPlayGameOutput - The return type for the autoPlayGame function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

// todo implement auto play for an AI

const AutoPlayGameInputSchema = z.object({
    gameId: z.string().describe('The unique identifier for the game.'),
    playerToken: z.string().describe('The player authentication token.'),
    gameState: z.string().describe('The current state of the game as a JSON string.'),
    possibleMoves: z
        .array(z.string())
        .describe('An array of legal moves in the current game state.'),
});
export type AutoPlayGameInput = z.infer<typeof AutoPlayGameInputSchema>;

const AutoPlayGameOutputSchema = z.object({
    move: z.string().describe('The AI-selected move to be played.'),
    reasoning: z.string().describe('The AI reasoning for selecting this move.'),
});
export type AutoPlayGameOutput = z.infer<typeof AutoPlayGameOutputSchema>;

export async function autoPlayGame(input: AutoPlayGameInput): Promise<AutoPlayGameOutput> {
    return autoPlayGameFlow(input);
}

const prompt = ai.definePrompt({
    name: 'autoPlayGamePrompt',
    input: { schema: AutoPlayGameInputSchema },
    output: { schema: AutoPlayGameOutputSchema },
    prompt: `You are an AI game expert. Given the current game state and possible moves, select the best move to play on behalf of the player.

Game ID: {{{gameId}}}
Player Token: {{{playerToken}}}
Current Game State: {{{gameState}}}
Possible Moves: {{#each possibleMoves}}{{{this}}}{{#unless @last}}, {{/unless}}{{/each}}

Based on the information above, choose the best move and provide your reasoning.

Return your answer as a JSON object with a 'move' and a 'reasoning' field. The 'move' field must be one of the possible moves. The 'reasoning' field should explain why you chose that move.
`,
});

const autoPlayGameFlow = ai.defineFlow(
    {
        name: 'autoPlayGameFlow',
        inputSchema: AutoPlayGameInputSchema,
        outputSchema: AutoPlayGameOutputSchema,
    },
    async (input) => {
        const { output } = await prompt(input);
        return output!;
    }
);
