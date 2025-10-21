
'use server';
/**
 * @fileOverview This file defines a Genkit flow for generating a personalized study plan.
 *
 * - generateStudyPlan - A function that creates a study plan.
 * - GenerateStudyPlanInput - The input type for the generateStudyPlan function.
 * - GenerateStudyPlanOutput - The return type for the generateStudyPlan function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateStudyPlanInputSchema = z.object({
    examTopic: z.string().describe('The topic or subject of the exam.'),
    examDate: z.string().describe('The date of the exam in YYYY-MM-DD format.'),
    currentDate: z.string().describe('The current date in YYYY-MM-DD format.'),
    hoursPerDay: z.number().describe('The number of hours the user can study each day.'),
});
export type GenerateStudyPlanInput = z.infer<typeof GenerateStudyPlanInputSchema>;

const GenerateStudyPlanOutputSchema = z.object({
  dailyPlan: z.array(
    z.object({
        day: z.number().describe('The day number of the study plan (e.g., 1, 2, 3).'),
        date: z.string().describe('The specific date for this part of the plan in a readable format (e.g., "July 29, 2024").'),
        tasks: z.array(z.object({
            taskName: z.string().describe('The name of the study task or topic.'),
            description: z.string().describe('A brief description of what to do in the task.'),
            durationMinutes: z.number().describe('The duration of the task in minutes.'),
        })).describe('A list of tasks for the day.'),
    })
  ).describe('The day-by-day study schedule.'),
});
export type GenerateStudyPlanOutput = z.infer<typeof GenerateStudyPlanOutputSchema>;

export async function generateStudyPlan(input: GenerateStudyPlanInput): Promise<GenerateStudyPlanOutput> {
  return generateStudyPlanFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateStudyPlanPrompt',
  input: {schema: GenerateStudyPlanInputSchema},
  output: {schema: GenerateStudyPlanOutputSchema},
  prompt: `You are an expert academic planner. Create a detailed, day-by-day study plan for a student based on the following information:

  - Exam Topic: {{{examTopic}}}
  - Current Date: {{{currentDate}}}
  - Exam Date: {{{examDate}}}
  - Available Study Hours Per Day: {{{hoursPerDay}}}

  Instructions:
  1.  Calculate the number of days available for study between the current date and the exam date (exclusive of the exam date).
  2.  Break down the '{{{examTopic}}}' into smaller, manageable sub-topics.
  3.  Distribute these sub-topics across the available study days.
  4.  For each day, create a list of specific tasks. Each task should have a name, a brief description of what to study, and a duration in minutes.
  5.  The total duration of tasks for a single day should not exceed the user's available '{{{hoursPerDay}}}'.
  6.  The plan should be logical and build upon concepts. Allocate the last day before the exam for revision.
  7.  Provide the output strictly in the format defined by the output schema.
  `,
});

const generateStudyPlanFlow = ai.defineFlow(
  {
    name: 'generateStudyPlanFlow',
    inputSchema: GenerateStudyPlanInputSchema,
    outputSchema: GenerateStudyPlanOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
