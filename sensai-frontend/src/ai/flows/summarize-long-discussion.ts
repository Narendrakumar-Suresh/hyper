'use server';

/**
 * @fileOverview Summarizes long discussions to provide users with key points quickly.
 *
 * - summarizeLongDiscussion - A function that summarizes a long discussion.
 * - SummarizeLongDiscussionInput - The input type for the summarizeLongDiscussion function.
 * - SummarizeLongDiscussionOutput - The return type for the summarizeLongDiscussion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeLongDiscussionInputSchema = z.object({
  discussion: z
    .string()
    .describe('The full text of the discussion to be summarized.'),
});
export type SummarizeLongDiscussionInput = z.infer<
  typeof SummarizeLongDiscussionInputSchema
>;

const SummarizeLongDiscussionOutputSchema = z.object({
  summary: z
    .string()
    .describe('A concise summary of the key points in the discussion.'),
});
export type SummarizeLongDiscussionOutput = z.infer<
  typeof SummarizeLongDiscussionOutputSchema
>;

export async function summarizeLongDiscussion(
  input: SummarizeLongDiscussionInput
): Promise<SummarizeLongDiscussionOutput> {
  return summarizeLongDiscussionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeLongDiscussionPrompt',
  input: {schema: SummarizeLongDiscussionInputSchema},
  output: {schema: SummarizeLongDiscussionOutputSchema},
  prompt: `Summarize the following discussion, extracting the key points and main arguments. Provide a concise summary that captures the essence of the conversation. The summary should be no more than 3 paragraphs.

Discussion:
{{{discussion}}}`,
});

const summarizeLongDiscussionFlow = ai.defineFlow(
  {
    name: 'summarizeLongDiscussionFlow',
    inputSchema: SummarizeLongDiscussionInputSchema,
    outputSchema: SummarizeLongDiscussionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
