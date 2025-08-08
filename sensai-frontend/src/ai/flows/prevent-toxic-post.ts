'use server';

/**
 * @fileOverview An AI flow to prevent toxic posts from being created.
 *
 * - preventToxicPost - A function that checks if a post contains toxic content.
 * - PreventToxicPostInput - The input type for the preventToxicPost function.
 * - PreventToxicPostOutput - The return type for the preventToxicPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PreventToxicPostInputSchema = z.object({
  title: z.string().describe('The title of the post.'),
  content: z.string().describe('The content of the post.'),
});
export type PreventToxicPostInput = z.infer<typeof PreventToxicPostInputSchema>;

const PreventToxicPostOutputSchema = z.object({
  isToxic: z
    .boolean()
    .describe(
      'Whether the post content is considered toxic, harassing, or spam.'
    ),
  reason: z
    .string()
    .describe(
      'A brief explanation of why the content is considered toxic. This will be shown to the user.'
    ),
});
export type PreventToxicPostOutput = z.infer<typeof PreventToxicPostOutputSchema>;

export async function preventToxicPost(
  input: PreventToxicPostInput
): Promise<PreventToxicPostOutput> {
  return preventToxicPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'preventToxicPostPrompt',
  input: {schema: PreventToxicPostInputSchema},
  output: {schema: PreventToxicPostOutputSchema},
  prompt: `You are an AI moderator for a learning platform's forum. Your role is to detect and prevent toxic content.

Analyze the following post (title and content). Determine if the content is toxic, contains harassment, or is spam.

- If it is toxic, set isToxic to true and provide a user-friendly reason like "This content may violate our community guidelines. Please rephrase to be more respectful."
- If it is not toxic, set isToxic to false and provide a reason like "This post is helpful and follows our community guidelines.".

Post Title: {{{title}}}
Post Content:
{{{content}}}`,
});

const preventToxicPostFlow = ai.defineFlow(
  {
    name: 'preventToxicPostFlow',
    inputSchema: PreventToxicPostInputSchema,
    outputSchema: PreventToxicPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
