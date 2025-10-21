"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { uploadTextbookAndFindAnswers, UploadTextbookAndFindAnswersOutput } from "@/ai/flows/upload-textbook-find-answers";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Upload, FileText, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  question: z.string().min(1, { message: "Please enter a question." }),
  file: z.instanceof(File).refine(file => file.size > 0, 'Please upload a file.'),
});

const fileToDataURL = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = error => reject(error);
        reader.readAsDataURL(file);
    });
};

export function TextbookAIClient() {
  const [result, setResult] = useState<UploadTextbookAndFindAnswersOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileName, setFileName] = useState('');
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { question: "" },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setResult(null);
    try {
        const textbookDataUri = await fileToDataURL(values.file);
        const response = await uploadTextbookAndFindAnswers({
            question: values.question,
            textbookDataUri,
        });
        setResult(response);
    } catch (error) {
      console.error(error);
      toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Failed to process the textbook. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Textbook AI</h1>
        <p className="text-muted-foreground">Upload your textbook PDF and get answers to your questions instantly.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>AI Question Search</CardTitle>
          <CardDescription>Upload a PDF and ask a question related to its content.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
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

              <FormField control={form.control} name="question" render={({ field }) => (
                <FormItem>
                  <FormLabel>Your Question</FormLabel>
                  <FormControl>
                    <Textarea placeholder="e.g., What are the main causes of the Cold War according to chapter 5?" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )} />
              
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Searching...</> : "Find Answer"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <div className="text-center p-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> <p className="mt-2 text-muted-foreground">AI is reading your textbook and finding the answer...</p></div>}

      {result && (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><FileText className="text-primary"/> Extracted Answer</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap">{result.answer}</p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 font-headline"><Sparkles className="text-accent" /> AI Summary</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="whitespace-pre-wrap text-muted-foreground">{result.summary}</p>
                </CardContent>
            </Card>
        </div>
      )}
    </div>
  );
}
