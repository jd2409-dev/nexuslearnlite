
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating quizzes.
 *
 * - generateQuiz - A function that generates a quiz from a topic or PDF.
 * - GenerateQuizInput - The input type for the generateQuiz function.
 * - GenerateQuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const GenerateQuizInputSchema = z.object({
  sourceType: z.enum(['topic', 'pdf']).describe('The source of the content for the quiz.'),
  content: z
    .string()
    .describe(
      "The content to generate the quiz from. This can be a topic string or a PDF file as a data URI."
    ),
  questionType: z.enum(['mcqs', '1_mark', '2_marks', '3_marks', '5_marks', 'fill_in_the_blanks']).describe('The type of questions to generate.'),
  numberOfQuestions: z.number().int().min(1).describe('The number of questions to generate.'),
});
export type GenerateQuizInput = z.infer<typeof GenerateQuizInputSchema>;

const GenerateQuizOutputSchema = z.object({
  title: z.string().describe('The title of the generated quiz.'),
  questions: z.array(
    z.object({
      questionText: z.string().describe('The text of the question.'),
      options: z.array(z.string()).optional().describe('A list of options for MCQs.'),
      answer: z.string().describe('The correct answer for the question.'),
    })
  ),
});
export type GenerateQuizOutput = z.infer<typeof GenerateQuizOutputSchema>;

export async function generateQuiz(input: GenerateQuizInput): Promise<GenerateQuizOutput> {
  // Add a property to the input to make the handlebars template simpler.
  const templateInput = {
    ...input,
    isTopic: input.sourceType === 'topic',
    isPdf: input.sourceType === 'pdf',
  };
  return generateQuizFlow(templateInput);
}

const prompt = ai.definePrompt({
  name: 'generateQuizPrompt',
  input: { schema: GenerateQuizInputSchema.extend({ isTopic: z.boolean(), isPdf: z.boolean() }) },
  output: { schema: GenerateQuizOutputSchema },
  prompt: `You are an expert quiz creator for students. Generate a quiz based on the provided details.

  Source Type: {{{sourceType}}}
  {{#if isTopic}}
  Topic: {{{content}}}
  {{/if}}
  {{#if isPdf}}
  PDF Document: {{media url=content}}
  {{/if}}
  Question Type: {{{questionType}}}
  Number of Questions: {{{numberOfQuestions}}}

  Instructions:
  1. Create a quiz with a relevant title.
  2. Generate exactly {{{numberOfQuestions}}} questions of the type '{{{questionType}}}'.
  3. For MCQs, provide 4 options. For other types, the 'options' array can be empty.
  4. Provide a clear and correct answer for each question.
  5. Ensure the questions are relevant to the provided content.
  `,
});

const generateQuizFlow = ai.defineFlow(
  {
    name: 'generateQuizFlow',
    inputSchema: GenerateQuizInputSchema.extend({ isTopic: z.boolean(), isPdf: z.boolean() }),
    outputSchema: GenerateQuizOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
