
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { gradeEssay, GradeEssayOutput } from "@/ai/flows/grade-essay-flow";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Sparkles, AlertTriangle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const formSchema = z.object({
  essayText: z.string().min(50, { message: "Essay must be at least 50 characters long." }),
});

export function EssayGraderClient() {
  const [result, setResult] = useState<GradeEssayOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      essayText: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
      const gradingResult = await gradeEssay({ essayText: values.essayText });
      setResult(gradingResult);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "An error occurred",
        description: "Failed to grade the essay. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Essay Grader</h1>
        <p className="text-muted-foreground">Get instant AI-powered feedback on your writing.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Submit Your Essay</CardTitle>
          <CardDescription>Paste your essay below to receive a grade and constructive feedback.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="essayText"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Essay Content</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Paste your essay here..."
                        rows={15}
                        className="text-base"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Grading...</> : <><Sparkles className="mr-2 h-4 w-4" /> Grade Essay</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && (
        <div className="text-center p-8">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="mt-2 text-muted-foreground">AI is analyzing your essay...</p>
        </div>
      )}

      {result && (
        <Card>
          <CardHeader>
              <CardTitle>Grading Results</CardTitle>
              <CardDescription>Here's the breakdown of your essay's score and feedback.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            
            <div className="p-4 border rounded-lg bg-muted/50">
                <div className="flex justify-between items-center mb-2">
                    <h3 className="font-bold text-lg">Overall Score</h3>
                    <span className="text-2xl font-bold text-primary">{result.overallScore.toFixed(1)}/10</span>
                </div>
                <Progress value={result.overallScore * 10} className="h-2" />
                <p className="mt-3 text-sm text-muted-foreground">{result.overallFeedback}</p>
            </div>
            
            <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Clarity: {result.clarity.score}/10</h4>
                    <p className="text-sm text-muted-foreground mt-2">{result.clarity.feedback}</p>
                </div>
                <div className="p-4 border rounded-lg">
                    <h4 className="font-semibold">Message Conveyed: {result.messageConveyed.score}/10</h4>
                    <p className="text-sm text-muted-foreground mt-2">{result.messageConveyed.feedback}</p>
                </div>
            </div>

            <div className={`p-4 border rounded-lg ${result.aiGenerated.isAiGenerated ? 'border-destructive bg-destructive/10' : 'border-primary/50'}`}>
                <div className="flex items-center gap-2">
                    {result.aiGenerated.isAiGenerated && <AlertTriangle className="h-5 w-5 text-destructive" />}
                    <h4 className="font-semibold">AI Generation Check</h4>
                </div>
                <p className={`font-bold mt-1 ${result.aiGenerated.isAiGenerated ? 'text-destructive' : 'text-primary'}`}>
                    {result.aiGenerated.isAiGenerated ? `Likely AI-Generated (Confidence: ${(result.aiGenerated.confidence * 100).toFixed(0)}%)` : `Likely Human-Written (Confidence: ${(result.aiGenerated.confidence * 100).toFixed(0)}%)`}
                </p>
                <p className="text-sm text-muted-foreground mt-2">{result.aiGenerated.explanation}</p>
            </div>

          </CardContent>
        </Card>
      )}
    </div>
  );
}
