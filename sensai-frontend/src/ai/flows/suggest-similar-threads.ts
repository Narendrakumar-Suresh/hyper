/**
 * @fileOverview This file defines a Genkit flow for suggesting similar threads based on a given thread's content.
 *
 * - suggestSimilarThreads - An async function that takes a thread's content as input and returns a list of similar thread titles.
 * - SuggestSimilarThreadsInput - The input type for the suggestSimilarThreads function.
 * - SuggestSimilarThreadsOutput - The output type for the suggestSimilarThreads function.
 */

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestSimilarThreadsInputSchema = z.object({
  threadContent: z.string().describe('The content of the thread to find similar threads for.'),
});

export type SuggestSimilarThreadsInput = z.infer<typeof SuggestSimilarThreadsInputSchema>;

const SuggestSimilarThreadsOutputSchema = z.object({
  similarThreadTitles: z.array(z.string()).describe('A list of titles of similar threads.'),
});

export type SuggestSimilarThreadsOutput = z.infer<typeof SuggestSimilarThreadsOutputSchema>;

export async function suggestSimilarThreads(input: SuggestSimilarThreadsInput): Promise<SuggestSimilarThreadsOutput> {
  return suggestSimilarThreadsFlow(input);
}

const suggestSimilarThreadsPrompt = ai.definePrompt({
  name: 'suggestSimilarThreadsPrompt',
  input: {schema: SuggestSimilarThreadsInputSchema},
  output: {schema: SuggestSimilarThreadsOutputSchema},
  prompt: `You are a helpful assistant designed to suggest similar threads based on the content of a given thread.

  Given the following thread content, suggest a list of similar thread titles.

  Thread Content: {{{threadContent}}}

  Format your response as a JSON object with a single field called "similarThreadTitles" which is an array of strings.
  Each string should be the title of a similar thread.
  Do not include any explanation or introductory text in your response, and there should be no characters outside the JSON object.
  `,
});

const suggestSimilarThreadsFlow = ai.defineFlow(
  {
    name: 'suggestSimilarThreadsFlow',
    inputSchema: SuggestSimilarThreadsInputSchema,
    outputSchema: SuggestSimilarThreadsOutputSchema,
  },
  async input => {
    const {output} = await suggestSimilarThreadsPrompt(input);
    return output!;
  }
);
