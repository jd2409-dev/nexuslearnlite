
'use server';
/**
 * @fileOverview This file defines a Genkit flow for grading essays.
 *
 * - gradeEssay - A function that grades an essay.
 * - GradeEssayInput - The input type for the gradeEssay function.
 * - GradeEssayOutput - The return type for the gradeEssay function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GradeEssayInputSchema = z.object({
  essayText: z.string().describe('The full text of the essay to be graded.'),
});
export type GradeEssayInput = z.infer<typeof GradeEssayInputSchema>;

const GradeEssayOutputSchema = z.object({
  clarity: z.object({
    score: z.number().describe('A score from 0 to 10 for clarity.'),
    feedback: z.string().describe('Specific feedback on the essay\'s clarity.'),
  }),
  messageConveyed: z.object({
    score: z.number().describe('A score from 0 to 10 for how well the message is conveyed.'),
    feedback: z.string().describe('Specific feedback on the message and arguments.'),
  }),
  aiGenerated: z.object({
    isAiGenerated: z.boolean().describe('Whether the text is likely AI-generated.'),
    confidence: z.number().describe('A confidence score (0-1) for the AI generation check.'),
    explanation: z.string().describe('An explanation for the AI generation verdict.'),
  }),
  overallScore: z.number().describe('An overall score for the essay from 0 to 10.'),
  overallFeedback: z.string().describe('Overall feedback and suggestions for improvement.'),
});
export type GradeEssayOutput = z.infer<typeof GradeEssayOutputSchema>;

export async function gradeEssay(input: GradeEssayInput): Promise<GradeEssayOutput> {
  return gradeEssayFlow(input);
}

const prompt = ai.definePrompt({
  name: 'gradeEssayPrompt',
  input: {schema: GradeEssayInputSchema},
  output: {schema: GradeEssayOutputSchema},
  prompt: `You are an expert essay grader. Analyze the following essay based on three criteria: clarity, message conveyance, and originality (i.e., whether it seems AI-generated).

  Essay Text:
  {{{essayText}}}

  Instructions:
  1.  **Clarity**: Evaluate the structure, grammar, and readability. Provide a score from 0-10 and constructive feedback.
  2.  **Message Conveyed**: Assess how effectively the essay presents its arguments and conveys its core message. Provide a score from 0-10 and feedback.
  3.  **AI-Generated Check**: Analyze the text for patterns typical of AI generation (e.g., overly generic phrasing, lack of personal voice, perfect structure). Set 'isAiGenerated' to true or false, provide a confidence score (0.0 to 1.0), and a brief explanation for your conclusion.
  4.  **Overall Score & Feedback**: Provide a weighted overall score out of 10 and a summary of the feedback with actionable suggestions for improvement.
  5.  Provide the output strictly in the format defined by the output schema.
  `,
});

const gradeEssayFlow = ai.defineFlow(
  {
    name: 'gradeEssayFlow',
    inputSchema: GradeEssayInputSchema,
    outputSchema: GradeEssayOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
