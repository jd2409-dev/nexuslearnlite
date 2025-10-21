'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating mock exams based on the curriculum and user progress.
 *
 * - createMockExam - A function that generates a mock exam.
 * - CreateMockExamInput - The input type for the createMockExam function.
 * - CreateMockExamOutput - The return type for the createMockExam function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CreateMockExamInputSchema = z.object({
  subject: z.string().describe('The subject for which to generate the mock exam.'),
  gradeLevel: z.string().describe('The grade level of the student.'),
  curriculum: z.string().describe('The curriculum or board (e.g., CBSE, ICSE, etc.).'),
  userProgress: z.string().describe('A description of the user progress in the subject.'),
  examType: z.string().describe('The type of exam (e.g., mock, practice, final).'),
  numberOfQuestions: z.number().describe('The number of questions to include in the exam.'),
});

export type CreateMockExamInput = z.infer<typeof CreateMockExamInputSchema>;

const CreateMockExamOutputSchema = z.object({
  examTitle: z.string().describe('The title of the generated mock exam.'),
  questions: z.array(
    z.object({
      question: z.string().describe('The text of the question.'),
      options: z.array(z.string()).describe('The possible answer options.'),
      correctAnswer: z.string().describe('The correct answer to the question.'),
      explanation: z.string().describe('Explanation of the correct answer.'),
    })
  ).describe('The questions in the mock exam.'),
  examReadinessScorePrediction: z.number().describe('Predicted exam readiness score based on AI analysis.')
});

export type CreateMockExamOutput = z.infer<typeof CreateMockExamOutputSchema>;

export async function createMockExam(input: CreateMockExamInput): Promise<CreateMockExamOutput> {
  return createMockExamFlow(input);
}

const createMockExamPrompt = ai.definePrompt({
  name: 'createMockExamPrompt',
  input: {schema: CreateMockExamInputSchema},
  output: {schema: CreateMockExamOutputSchema},
  prompt: `You are an expert in creating mock exams for students.

  Generate a mock exam for a student with the following characteristics:

  Subject: {{{subject}}}
  Grade Level: {{{gradeLevel}}}
  Curriculum: {{{curriculum}}}
  User Progress: {{{userProgress}}}
  Exam Type: {{{examType}}}
  Number of Questions: {{{numberOfQuestions}}}

  The mock exam should have a title and a set of questions. Each question should have options, a correct answer, and an explanation.
  Also provide predicted exam readiness score. 

  Make sure the questions are relevant to the subject, grade level, and curriculum, and adjust the difficulty based on the user's progress.
  Follow the CreateMockExamOutputSchema format strictly.
  `,
});

const examReadinessScore = ai.defineTool({
  name: 'examReadinessScore',
  description: 'Predicts an exam readiness score based on user progress and performance in mock exams.',
  inputSchema: z.object({
    userProgress: z.string().describe('A description of the user progress in the subject.'),
  }),
  outputSchema: z.number().describe('The predicted exam readiness score.'),
}, async (input) => {
  // This is a placeholder implementation. Replace with actual logic to predict the score.
  // For example, you might analyze the userProgress string and return a score based on keywords.
  if (input.userProgress.includes('mastered')) {
    return 90;
  } else if (input.userProgress.includes('good understanding')) {
    return 75;
  } else {
    return 50;
  }
});

const createMockExamFlow = ai.defineFlow(
  {
    name: 'createMockExamFlow',
    inputSchema: CreateMockExamInputSchema,
    outputSchema: CreateMockExamOutputSchema,
  },
  async input => {
    const {output} = await createMockExamPrompt(input);

    // Invoke the tool to predict the exam readiness score
    const examReadinessScorePrediction = await examReadinessScore({
      userProgress: input.userProgress,
    });

    // Ensure output is not null before accessing properties
    if (output) {
      // Update the output with the predicted exam readiness score
      output.examReadinessScorePrediction = examReadinessScorePrediction;
    }

    return output!;
  }
);
