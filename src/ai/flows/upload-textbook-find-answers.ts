'use server';

/**
 * @fileOverview This file implements the Genkit flow for the UploadTextbookAndFindAnswers story.
 *
 * - uploadTextbookAndFindAnswers - A function that handles the textbook upload and question answering process.
 * - UploadTextbookAndFindAnswersInput - The input type for the uploadTextbookAndFindAnswers function.
 * - UploadTextbookAndFindAnswersOutput - The return type for the uploadTextbookAndFindAnswers function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const UploadTextbookAndFindAnswersInputSchema = z.object({
  textbookDataUri: z
    .string()
    .describe(
      "A textbook in PDF format, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  question: z.string().describe('The question related to the textbook content.'),
});
export type UploadTextbookAndFindAnswersInput = z.infer<
  typeof UploadTextbookAndFindAnswersInputSchema
>;

const UploadTextbookAndFindAnswersOutputSchema = z.object({
  answer: z.string().describe('The answer to the question extracted from the textbook.'),
  summary: z.string().describe('A summarized explanation of the answer.'),
});
export type UploadTextbookAndFindAnswersOutput = z.infer<
  typeof UploadTextbookAndFindAnswersOutputSchema
>;

export async function uploadTextbookAndFindAnswers(
  input: UploadTextbookAndFindAnswersInput
): Promise<UploadTextbookAndFindAnswersOutput> {
  return uploadTextbookAndFindAnswersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'uploadTextbookAndFindAnswersPrompt',
  input: {schema: UploadTextbookAndFindAnswersInputSchema},
  output: {schema: UploadTextbookAndFindAnswersOutputSchema},
  prompt: `You are an AI assistant designed to answer questions based on the content of a textbook.

  You will be provided with a textbook in PDF format and a question related to the textbook content.
  Your task is to extract the answer from the textbook and provide a summarized explanation.

  Textbook: {{media url=textbookDataUri}}
  Question: {{{question}}}

  Answer:`, // Provide a default answer if no answer is found, and the summary should state that no answer was found in the textbook.
});

const uploadTextbookAndFindAnswersFlow = ai.defineFlow(
  {
    name: 'uploadTextbookAndFindAnswersFlow',
    inputSchema: UploadTextbookAndFindAnswersInputSchema,
    outputSchema: UploadTextbookAndFindAnswersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
