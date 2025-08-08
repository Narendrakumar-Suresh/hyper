'use server';

/**
 * @fileOverview An AI mentor bot that answers frequently asked questions.
 *
 * - answerFAQs - A function that answers FAQs using a Genkit flow.
 * - AnswerFAQsInput - The input type for the answerFAQs function.
 * - AnswerFAQsOutput - The return type for the answerFAQs function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerFAQsInputSchema = z.object({
  question: z.string().describe('The question to be answered.'),
});
export type AnswerFAQsInput = z.infer<typeof AnswerFAQsInputSchema>;

const AnswerFAQsOutputSchema = z.object({
  answer: z.string().describe('The answer to the question.'),
});
export type AnswerFAQsOutput = z.infer<typeof AnswerFAQsOutputSchema>;

export async function answerFAQs(input: AnswerFAQsInput): Promise<AnswerFAQsOutput> {
  return answerFAQsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerFAQsPrompt',
  input: {schema: AnswerFAQsInputSchema},
  output: {schema: AnswerFAQsOutputSchema},
  prompt: `You are a helpful AI mentor bot that answers frequently asked questions.

  Question: {{{question}}}
  Answer: `,
});

const answerFAQsFlow = ai.defineFlow(
  {
    name: 'answerFAQsFlow',
    inputSchema: AnswerFAQsInputSchema,
    outputSchema: AnswerFAQsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
