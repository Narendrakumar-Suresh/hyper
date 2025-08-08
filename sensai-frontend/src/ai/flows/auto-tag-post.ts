'use server';

/**
 * @fileOverview Automatically suggests tags for a post using AI.
 *
 * - autoTagPost - A function that suggests tags for a given post.
 * - AutoTagPostInput - The input type for the autoTagPost function.
 * - AutoTagPostOutput - The return type for the autoTagPost function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AutoTagPostInputSchema = z.object({
  postContent: z.string().describe('The content of the post to tag.'),
});
export type AutoTagPostInput = z.infer<typeof AutoTagPostInputSchema>;

const AutoTagPostOutputSchema = z.object({
  tags: z.array(z.string()).describe('An array of suggested tags for the post.'),
});
export type AutoTagPostOutput = z.infer<typeof AutoTagPostOutputSchema>;

export async function autoTagPost(input: AutoTagPostInput): Promise<AutoTagPostOutput> {
  return autoTagPostFlow(input);
}

const prompt = ai.definePrompt({
  name: 'autoTagPostPrompt',
  input: {schema: AutoTagPostInputSchema},
  output: {schema: AutoTagPostOutputSchema},
  prompt: `You are a helpful assistant that suggests tags for a given post.  Given the content of the post, suggest relevant tags that would help categorize the post and improve its discoverability.

Post Content: {{{postContent}}}

Tags:`, // Ensure the prompt ends with "Tags:" so the LLM knows what to output
});

const autoTagPostFlow = ai.defineFlow(
  {
    name: 'autoTagPostFlow',
    inputSchema: AutoTagPostInputSchema,
    outputSchema: AutoTagPostOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
