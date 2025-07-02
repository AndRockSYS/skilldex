'use server';

import { ai } from '@/ai/genkit';

import {
    generateTauntInput,
    generateTauntOutput,
    GenerateTauntInput,
    GenerateTauntOutput,
} from '@/lib/zod';

export async function generateChallengeTaunt(
    input: GenerateTauntInput
): Promise<GenerateTauntOutput> {
    return generateChallengeTauntFlow(input);
}

const prompt = ai.definePrompt({
    name: 'generateChallengeTauntPrompt',
    input: { schema: generateTauntInput },
    output: { schema: generateTauntOutput },
    prompt: `You are a witty and slightly cheeky gamer. Generate a short, exciting, and mildly provocative (but not offensive or toxic) challenge message or taunt for a {{gameName}} game. 
The stake is {{stakeAmount}} {{token}}. 
{{#if creatorHandle}}The challenge is issued by {{creatorHandle}}. You can subtly weave this into the taunt if it feels natural, otherwise, focus on the game and stake.{{/if}}
The message MUST be tweet-sized (under 260 characters to leave room for the link). 
It should encourage others to accept the challenge.
Crucially, your response MUST include the exact placeholder "{{CHALLENGE_LINK}}" (without quotes, with the double curly braces) where the actual challenge link will be inserted by the application.
Do not use hashtags.
Make it sound like a real gamer wrote it. Keep it punchy and energetic.
Example output format: "Just dropped {{stakeAmount}} {{token}} on a {{gameName}} match. Think you can hang? Prove it: {{CHALLENGE_LINK}}"
Another example: "Who's brave enough to face me in {{gameName}} for {{stakeAmount}} {{token}}? Step up: {{CHALLENGE_LINK}}"
`,
    config: {
        safetySettings: [
            { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
            { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
            { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
            { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_MEDIUM_AND_ABOVE' },
        ],
    },
});

const generateChallengeTauntFlow = ai.defineFlow(
    {
        name: 'generateChallengeTauntFlow',
        inputSchema: generateTauntInput,
        outputSchema: generateTauntOutput,
    },
    async (input: any) => {
        // Basic input validation or transformation can happen here if needed
        const { output } = await prompt(input);
        if (!output || !output.tauntText) {
            throw new Error('AI failed to generate taunt text.');
        }
        if (!output.tauntText.includes('{{CHALLENGE_LINK}}')) {
            // Fallback if AI forgets the placeholder - very important
            console.warn('AI did not include {{CHALLENGE_LINK}}, appending it.');
            return { tauntText: output.tauntText + ' {{CHALLENGE_LINK}}' };
        }
        return output;
    }
);
