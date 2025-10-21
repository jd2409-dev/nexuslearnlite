
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateQuiz, GenerateQuizOutput } from "@/ai/flows/generate-quiz-flow";
import { useToast } from "@/hooks/use-toast";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Wand2, Upload } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";

const formSchema = z.object({
  source: z.enum(['topic', 'pdf']),
  topic: z.string().optional(),
  file: z.instanceof(File).optional(),
  questionType: z.enum(['mcqs', '1_mark', '2_marks', '3_marks', '5_marks', 'fill_in_the_blanks']),
  numberOfQuestions: z.coerce.number().min(3).max(20),
}).refine(data => {
    if (data.source === 'topic') return !!data.topic;
    if (data.source === 'pdf') return !!data.file;
    return false;
}, {
    message: "Please provide a topic or a PDF file.",
    path: ['topic'],
});

const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

export function QuizGeneratorClient() {
  const [quiz, setQuiz] = useState<GenerateQuizOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      source: 'topic',
      questionType: 'mcqs',
      numberOfQuestions: 5,
    },
  });

  const source = form.watch('source');

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setQuiz(null);
    try {
      let content = "";
      if (values.source === 'topic') {
        content = values.topic!;
      } else if (values.source === 'pdf' && values.file) {
        content = await fileToDataURL(values.file);
      }
      
      const result = await generateQuiz({
          sourceType: values.source,
          content: content,
          questionType: values.questionType,
          numberOfQuestions: values.numberOfQuestions,
      });
      setQuiz(result);

    } catch (error) {
      console.error(error);
      toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Failed to generate the quiz. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Quiz Generator</h1>
        <p className="text-muted-foreground">Create quizzes from a topic or a PDF document.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Generate a New Quiz</CardTitle>
          <CardDescription>Let our AI create a custom quiz for you.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField control={form.control} name="source" render={({ field }) => (
                  <FormItem>
                      <FormLabel>Quiz Source</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                          <SelectContent>
                              <SelectItem value="topic">From Topic</SelectItem>
                              <SelectItem value="pdf">From PDF</SelectItem>
                          </SelectContent>
                      </Select>
                  </FormItem>
              )} />
              
              {source === 'topic' && (
                <FormField control={form.control} name="topic" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Topic</FormLabel>
                        <FormControl><Input placeholder="e.g., The French Revolution" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              )}

              {source === 'pdf' && (
                <FormField control={form.control} name="file" render={({ field }) => (
                    <FormItem>
                      <FormLabel>Textbook (PDF)</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Button type="button" variant="outline" className="w-full justify-start text-left font-normal" asChild>
                            <label htmlFor="file-upload">
                              <Upload className="mr-2 h-4 w-4" />
                              {fileName || "Click to upload a PDF"}
                            </label>
                          </Button>
                          <Input id="file-upload" type="file" accept=".pdf" className="sr-only"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                    field.onChange(file);
                                    setFileName(file.name);
                                }
                            }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="questionType" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Question Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl><SelectTrigger><SelectValue /></SelectTrigger></FormControl>
                            <SelectContent>
                                <SelectItem value="mcqs">Multiple Choice</SelectItem>
                                <SelectItem value="1_mark">1-Mark Questions</SelectItem>
                                <SelectItem value="2_marks">2-Mark Questions</SelectItem>
                                <SelectItem value="3_marks">3-Mark Questions</SelectItem>
                                <SelectItem value="5_marks">5-Mark Questions</SelectItem>
                                <SelectItem value="fill_in_the_blanks">Fill in the Blanks</SelectItem>
                            </SelectContent>
                        </Select>
                    </FormItem>
                )} />
                <FormField control={form.control} name="numberOfQuestions" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Number of Questions</FormLabel>
                        <FormControl><Input type="number" min="3" max="20" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              </div>
              
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Quiz...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate Quiz</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <div className="text-center p-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> <p className="mt-2 text-muted-foreground">AI is crafting your quiz...</p></div>}

      {quiz && (
        <Card>
            <CardHeader>
                <CardTitle>{quiz.title}</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    {quiz.questions.map((q, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                            <p className="font-semibold">{i + 1}. {q.questionText}</p>
                            {q.options && q.options.length > 0 && (
                                <ul className="list-disc list-inside mt-2 space-y-1">
                                    {q.options.map((opt, j) => <li key={j}>{opt}</li>)}
                                </ul>
                            )}
                            <p className="text-sm text-primary mt-2 font-medium">Answer: {q.answer}</p>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
