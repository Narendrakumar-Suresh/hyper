'use server';

/**
 * @fileOverview An AI flow to suggest linking a new discussion to specific lessons or quiz items.
 *
 * - suggestThreadLinks - A function that suggests links for a given post.
 * - SuggestThreadLinksInput - The input type for the suggestThreadLinks function.
 * - SuggestThreadLinksOutput - The return type for the suggestThreadLinks function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestThreadLinksInputSchema = z.object({
  title: z.string().describe('The title of the post.'),
  content: z.string().describe('The content of the post.'),
});
export type SuggestThreadLinksInput = z.infer<typeof SuggestThreadLinksInputSchema>;

const SuggestThreadLinksOutputSchema = z.object({
  linkedTask: z
    .string()
    .describe(
      'The name of a relevant task (e.g., a lesson or quiz) to link to the post. Should be concise and descriptive.'
    ),
  linkedSkill: z
    .string()
    .describe(
      'The name of a relevant skill to link to the post. Should be a single concept (e.g., "Recursion").'
    ),
});
export type SuggestThreadLinksOutput = z.infer<typeof SuggestThreadLinksOutputSchema>;

export async function suggestThreadLinks(
  input: SuggestThreadLinksInput
): Promise<SuggestThreadLinksOutput> {
  return suggestThreadLinksFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestThreadLinksPrompt',
  input: {schema: SuggestThreadLinksInputSchema},
  output: {schema: SuggestThreadLinksOutputSchema},
  prompt: `You are an AI assistant for a learning platform. Your task is to suggest connections between a new user-created post and existing course materials.

Based on the post's title and content, suggest a "linkedTask" and a "linkedSkill".

- "linkedTask" should be a specific, descriptive name for a lesson, quiz, or activity. For example: "Lesson: Introduction to Big O Notation" or "Quiz: Sorting Algorithms".
- "linkedSkill" should be a single, core concept. For example: "Big O Notation" or "Sorting Algorithms".

Here is the post information:
Post Title: {{{title}}}
Post Content:
{{{content}}}
`,
});

const suggestThreadLinksFlow = ai.defineFlow(
  {
    name: 'suggestThreadLinksFlow',
    inputSchema: SuggestThreadLinksInputSchema,
    outputSchema: SuggestThreadLinksOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
