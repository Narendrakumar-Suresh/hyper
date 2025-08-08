'use server';

/**
 * @fileOverview An AI flow to prevent direct answers from being posted in a forum.
 *
 * - preventDirectAnswer - A function that checks if a post contains a direct answer to a question.
 * - PreventDirectAnswerInput - The input type for the preventDirectAnswer function.
 * - PreventDirectAnswerOutput - The return type for the preventDirectAnswer function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PreventDirectAnswerInputSchema = z.object({
  title: z.string().describe('The title of the post.'),
  content: z.string().describe('The content of the post.'),
});
export type PreventDirectAnswerInput = z.infer<typeof PreventDirectAnswerInputSchema>;

const PreventDirectAnswerOutputSchema = z.object({
  isDirectAnswer: z
    .boolean()
    .describe(
      'Whether the post content provides a direct answer to a question that could be inferred from the title or content.'
    ),
  reason: z
    .string()
    .describe(
      'A brief explanation of why the content is considered a direct answer. This will be shown to the user.'
    ),
});
export type PreventDirectAnswerOutput = z.infer<typeof PreventDirectAnswerOutputSchema>;

export async function preventDirectAnswer(
  input: PreventDirectAnswerInput
): Promise<PreventDirectAnswerOutput> {
  return preventDirectAnswerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'preventDirectAnswerPrompt',
  input: {schema: PreventDirectAnswerInputSchema},
  output: {schema: PreventDirectAnswerOutputSchema},
  prompt: `You are an AI moderator for a learning platform's forum. Your primary role is to prevent users from posting direct, complete answers to questions. Instead, you should encourage them to provide hints, guiding questions, or explanations of concepts.

Analyze the following post (title and content). Determine if the 'content' provides a direct, complete answer to a question that is explicitly asked or strongly implied by the 'title' or the content itself.

If it is a direct answer, set isDirectAnswer to true and provide a brief, user-friendly reason. The reason should suggest an alternative, like "Instead of giving the full code, try explaining the key algorithm" or "This looks like a direct answer. Can you rephrase it as a hint?".

If the post is a question, a note, a discussion starter, or provides a hint without giving away the full solution, set isDirectAnswer to false and provide a brief reason like "This is a helpful hint." or "This is a valid question.".

Post Title: {{{title}}}
Post Content:
{{{content}}}`,
});

const preventDirectAnswerFlow = ai.defineFlow(
  {
    name: 'preventDirectAnswerFlow',
    inputSchema: PreventDirectAnswerInputSchema,
    outputSchema: PreventDirectAnswerOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
