
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
  insights: z.array(
      z.object({
        observation: z.string().describe("A key observation about the user's performance, like a common mistake or weak area."),
        suggestion: z.string().describe("A specific, actionable suggestion to address the observation and improve future performance."),
        example: z.string().describe("A concrete example from the quiz that illustrates the point."),
      })
  ).describe('A list of AI-generated insights and suggestions for improvement.')
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
  prompt: `You are an expert academic advisor and learning coach. Your goal is to provide encouraging, insightful, and highly actionable feedback to a student based on their recent quiz performance.

  **Analysis Task:**
  1.  **Identify Patterns:** Carefully analyze the incorrect answers in the provided quiz history. Look for recurring themes. Does the student struggle with a specific sub-topic, a particular type of question (e.g., definitions, applications), or a common misconception?
  2.  **Formulate Observations:** For each pattern you identify, formulate a clear and concise "observation." This should neutrally describe the weak area.
  3.  **Create Actionable Suggestions:** For each observation, provide a concrete and actionable "suggestion." This should be a clear step the student can take to improve. Avoid generic advice like "study more." Instead, suggest specific actions like "review the definition of X" or "practice Y-type problems."
  4.  **Provide a Concrete Example:** For each observation, pull a specific "example" question from their incorrect answers that illustrates the point you are making.

  **Output Format:**
  Provide a list of 2-3 distinct insights. Each insight must contain an observation, a suggestion, and an example.

  **Student's Quiz History:**
  {{#each processedHistory}}
  - **Quiz:** "{{quizTitle}}"
  - **Score:** {{score}}%
  - **Incorrect Answers:**
    {{#if incorrectQuestions.length}}
      {{#each incorrectQuestions}}
      - **Question:** "{{questionText}}"
        - **Your Answer:** "{{userAnswer}}"
        - **Correct Answer:** "{{correctAnswer}}"
      {{/each}}
    {{else}}
      - None! Great job!
    {{/if}}
  {{/each}}

  Now, generate the structured feedback based on your analysis.`,
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
