'use server';
/**
 * @fileOverview Provides AI tutoring and homework assistance.
 *
 * - aiTutorHomeworkHelp - A function that provides AI tutoring and homework assistance.
 * - AiTutorHomeworkHelpInput - The input type for the aiTutorHomeworkHelp function.
 * - AiTutorHomeworkHelpOutput - The return type for the aiTutorHomeworkHelp function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AiTutorHomeworkHelpInputSchema = z.object({
  query: z.string().describe('The question or request for homework assistance.'),
});
export type AiTutorHomeworkHelpInput = z.infer<typeof AiTutorHomeworkHelpInputSchema>;

const AiTutorHomeworkHelpOutputSchema = z.object({
  answer: z.string().describe('The AI tutor\'s response to the query.'),
});
export type AiTutorHomeworkHelpOutput = z.infer<typeof AiTutorHomeworkHelpOutputSchema>;

export async function aiTutorHomeworkHelp(input: AiTutorHomeworkHelpInput): Promise<AiTutorHomeworkHelpOutput> {
  return aiTutorHomeworkHelpFlow(input);
}

const prompt = ai.definePrompt({
  name: 'aiTutorHomeworkHelpPrompt',
  input: {schema: AiTutorHomeworkHelpInputSchema},
  output: {schema: AiTutorHomeworkHelpOutputSchema},
  prompt: `You are an AI tutor assisting students with their questions and homework.

  Respond to the following query with a clear and helpful answer. Provide step-by-step explanations when appropriate.

  Query: {{{query}}}`,
});

const aiTutorHomeworkHelpFlow = ai.defineFlow(
  {
    name: 'aiTutorHomeworkHelpFlow',
    inputSchema: AiTutorHomeworkHelpInputSchema,
    outputSchema: AiTutorHomeworkHelpOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
