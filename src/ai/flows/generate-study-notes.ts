'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating study notes for a given subject.
 *
 * The flow takes a subject as input and returns AI-generated study notes.
 *
 * @interface GenerateStudyNotesInput - Defines the input schema for the generateStudyNotes function.
 * @interface GenerateStudyNotesOutput - Defines the output schema for the generateStudyNotes function.
 * @function generateStudyNotes - The main function that triggers the study note generation flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyNotesInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate study notes.'),
});

export type GenerateStudyNotesInput = z.infer<typeof GenerateStudyNotesInputSchema>;

const GenerateStudyNotesOutputSchema = z.object({
  notes: z.string().describe('The AI-generated study notes for the subject.'),
});

export type GenerateStudyNotesOutput = z.infer<typeof GenerateStudyNotesOutputSchema>;

export async function generateStudyNotes(input: GenerateStudyNotesInput): Promise<GenerateStudyNotesOutput> {
  return generateStudyNotesFlow(input);
}

const generateStudyNotesPrompt = ai.definePrompt({
  name: 'generateStudyNotesPrompt',
  input: {schema: GenerateStudyNotesInputSchema},
  output: {schema: GenerateStudyNotesOutputSchema},
  prompt: `You are an expert academic assistant. Your task is to generate comprehensive and concise study notes for the given subject.

Subject: {{{subject}}}

Please provide detailed study notes covering the key concepts, important formulas, and relevant examples.`,
});

const generateStudyNotesFlow = ai.defineFlow(
  {
    name: 'generateStudyNotesFlow',
    inputSchema: GenerateStudyNotesInputSchema,
    outputSchema: GenerateStudyNotesOutputSchema,
  },
  async input => {
    const {output} = await generateStudyNotesPrompt(input);
    return output!;
  }
);
