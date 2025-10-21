"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { createMockExam, CreateMockExamOutput } from "@/ai/flows/create-mock-exams";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, FileQuestion, CheckCircle, XCircle } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Bar, BarChart, ResponsiveContainer } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";

const formSchema = z.object({
  subject: z.string().min(1, { message: "Required" }),
  gradeLevel: z.string().min(1, { message: "Required" }),
  numberOfQuestions: z.coerce.number().min(1).max(20),
});

export function ExamPrepClient() {
  const [exam, setExam] = useState<CreateMockExamOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { subject: "Math", gradeLevel: "10", numberOfQuestions: 5 },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setExam(null);
    try {
      const result = await createMockExam({
        ...values,
        curriculum: "CBSE",
        userProgress: "good understanding of core concepts but needs practice in application",
        examType: "mock",
      });
      setExam(result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  const chartData = exam ? [{ name: "Score", score: exam.examReadinessScorePrediction, fill: "hsl(var(--primary))" }] : [];
  const chartConfig = { score: { label: "Readiness Score" } };

  return (
    <div className="container mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Exam Preparation</h1>
        <p className="text-muted-foreground">Generate mock exams and test your readiness.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Mock Exam</CardTitle>
          <CardDescription>Select your preferences and let the AI generate a test for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
              <FormField control={form.control} name="subject" render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger></FormControl>
                    <SelectContent>
                      <SelectItem value="Math">Math</SelectItem>
                      <SelectItem value="Physics">Physics</SelectItem>
                      <SelectItem value="Chemistry">Chemistry</SelectItem>
                      <SelectItem value="Biology">Biology</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="gradeLevel" render={({ field }) => (
                <FormItem>
                  <FormLabel>Grade</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Select grade" /></SelectTrigger></FormControl>
                    <SelectContent>{[...Array(7)].map((_, i) => (<SelectItem key={i+6} value={`${i+6}`}>{`Grade ${i+6}`}</SelectItem>))}</SelectContent>
                  </Select>
                </FormItem>
              )} />
              <FormField control={form.control} name="numberOfQuestions" render={({ field }) => (
                <FormItem>
                  <FormLabel>Questions</FormLabel>
                   <Select onValueChange={field.onChange} defaultValue={String(field.value)}>
                    <FormControl><SelectTrigger><SelectValue placeholder="Number of questions" /></SelectTrigger></FormControl>
                    <SelectContent>
                        <SelectItem value="5">5 Questions</SelectItem>
                        <SelectItem value="10">10 Questions</SelectItem>
                        <SelectItem value="15">15 Questions</SelectItem>
                    </SelectContent>
                  </Select>
                </FormItem>
              )} />
              <Button type="submit" disabled={isLoading} className="w-full">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : "Start Exam"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isLoading && <div className="text-center p-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> <p className="mt-2 text-muted-foreground">AI is preparing your exam...</p></div>}

      {exam && (
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-2xl font-headline font-semibold">{exam.examTitle}</h2>
            <Accordion type="single" collapsible className="w-full">
              {exam.questions.map((q, i) => (
                <AccordionItem value={`item-${i}`} key={i}>
                  <AccordionTrigger className="text-left hover:no-underline">
                    <div className="flex items-start gap-3">
                      <div className="font-bold">{i + 1}.</div>
                      <p>{q.question}</p>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="pl-8 space-y-2">
                      <p className="font-semibold">Options:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {q.options.map((opt, j) => <li key={j}>{opt}</li>)}
                      </ul>
                      <div className="pt-2">
                        <p className="font-semibold">Correct Answer:</p>
                        <div className="flex items-center gap-2 text-primary"><CheckCircle className="h-4 w-4" /> <p>{q.correctAnswer}</p></div>
                      </div>
                      <div className="pt-2">
                        <p className="font-semibold">Explanation:</p>
                        <p className="text-muted-foreground">{q.explanation}</p>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
          <div className="lg:col-span-1">
            <Card>
              <CardHeader>
                <CardTitle>Exam Readiness Score</CardTitle>
                <CardDescription>AI-powered prediction of your performance.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="w-full h-[200px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} layout="vertical" margin={{ left: 10, right: 10 }}>
                      <ChartTooltip cursor={{fill: 'hsl(var(--muted))'}} content={<ChartTooltipContent />} />
                      <Bar dataKey="score" radius={5} background={{ fill: 'hsl(var(--muted))', radius: 5 }} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-center text-4xl font-bold mt-4">{exam.examReadinessScorePrediction}%</p>
                <p className="text-center text-muted-foreground mt-1">
                  {exam.examReadinessScorePrediction > 80 ? "Excellent work! You're well prepared." : exam.examReadinessScorePrediction > 60 ? "Good job! A little more practice will help." : "Keep practicing to improve your score."}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </div>
  );
}
