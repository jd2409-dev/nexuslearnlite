
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating learning reflections.
 *
 * - generateReflections - Analyzes a user's quiz history to provide feedback.
 * - GenerateReflectionsInput - The input type for the flow.
 * - GenerateReflectionsOutput - The return type for the flow.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const QuizResultSchema = z.object({
  quizTitle: z.string(),
  score: z.number(),
  questions: z.array(
    z.object({
      questionText: z.string(),
      userAnswer: z.string(),
      correctAnswer: z.string(),
    })
  ),
});

const GenerateReflectionsInputSchema = z.object({
  quizHistory: z.array(QuizResultSchema).describe("The user's recent quiz results."),
});
export type GenerateReflectionsInput = z.infer<typeof GenerateReflectionsInputSchema>;

const GenerateReflectionsOutputSchema = z.object({
  suggestions: z.array(z.string()).describe('A list of actionable suggestions for the user to improve.'),
});
export type GenerateReflectionsOutput = z.infer<typeof GenerateReflectionsOutputSchema>;

export async function generateReflections(input: GenerateReflectionsInput): Promise<GenerateReflectionsOutput> {
  return generateReflectionsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateReflectionsPrompt',
  input: { schema: GenerateReflectionsInputSchema.extend({
    processedHistory: z.any() // For pre-processed data
  }) },
  output: { schema: GenerateReflectionsOutputSchema },
  prompt: `You are an expert academic advisor. Analyze the provided quiz history of a student and generate personalized, actionable suggestions for improvement.

  Focus on identifying patterns of mistakes. For example, do they struggle with a specific topic that appears in multiple quizzes? Do they consistently miss a certain type of question?

  Based on your analysis, provide a list of 3-5 clear and encouraging suggestions. Frame the feedback constructively.

  Quiz History:
  {{#each processedHistory}}
  - Quiz: "{{quizTitle}}", Score: {{score}}%
    Incorrect Answers:
    {{#each incorrectQuestions}}
    - Question: "{{questionText}}"
      Your Answer: "{{userAnswer}}", Correct Answer: "{{correctAnswer}}"
    {{/each}}
  {{/each}}

  Now, provide your suggestions for improvement.`,
  // Add retry logic for transient errors like 503
  backoff: {
    maxRetries: 3,
    delay: 2000, // Start with 2 seconds
    multiplier: 2, // Double the delay each time
  },
});


const generateReflectionsFlow = ai.defineFlow(
  {
    name: 'generateReflectionsFlow',
    inputSchema: GenerateReflectionsInputSchema,
    outputSchema: GenerateReflectionsOutputSchema,
  },
  async (input) => {
    // Pre-process the quiz history to create a list of incorrect questions
    const processedHistory = input.quizHistory.map(quiz => ({
      ...quiz,
      incorrectQuestions: quiz.questions.filter(q => q.userAnswer !== q.correctAnswer)
    }));

    const { output } = await prompt({ ...input, processedHistory });
    return output!;
  }
);
