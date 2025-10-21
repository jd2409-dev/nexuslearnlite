
"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { generateStudyPlan, GenerateStudyPlanOutput } from "@/ai/flows/generate-study-plan-flow";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Wand2, CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const formSchema = z.object({
  examTopic: z.string().min(1, { message: "Exam topic is required." }),
  examDate: z.date({ required_error: "Exam date is required." }),
  hoursPerDay: z.coerce.number().min(1, { message: "Must be at least 1 hour." }).max(12, { message: "Cannot exceed 12 hours." }),
});

export function StudyPlannerClient() {
  const [plan, setPlan] = useState<GenerateStudyPlanOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      hoursPerDay: 2,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setPlan(null);
    try {
      const result = await generateStudyPlan({
        ...values,
        examDate: format(values.examDate, 'yyyy-MM-dd'),
        currentDate: format(new Date(), 'yyyy-MM-dd'),
      });
      setPlan(result);
    } catch (error) {
      console.error(error);
      toast({
          variant: "destructive",
          title: "An error occurred",
          description: "Failed to generate the study plan. Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="container mx-auto space-y-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight font-headline">AI Study Planner</h1>
        <p className="text-muted-foreground">Let AI create a personalized study schedule for you.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create Your Study Plan</CardTitle>
          <CardDescription>Tell the AI about your exam and how much time you have to study.</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField control={form.control} name="examTopic" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Exam Topic / Subject</FormLabel>
                        <FormControl><Input placeholder="e.g., World War II, Organic Chemistry" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
                <FormField control={form.control} name="hoursPerDay" render={({ field }) => (
                    <FormItem>
                        <FormLabel>Study Hours per Day</FormLabel>
                        <FormControl><Input type="number" min="1" max="12" {...field} /></FormControl>
                        <FormMessage />
                    </FormItem>
                )} />
              </div>

              <FormField control={form.control} name="examDate" render={({ field }) => (
                  <FormItem className="flex flex-col">
                      <FormLabel>Exam Date</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            disabled={(date) =>
                              date < new Date(new Date().setDate(new Date().getDate() - 1))
                            }
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                  </FormItem>
              )} />
              
              <Button type="submit" disabled={isLoading} className="w-full md:w-auto">
                {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating Plan...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate Plan</>}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      {isLoading && <div className="text-center p-8"><Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" /> <p className="mt-2 text-muted-foreground">AI is building your study plan...</p></div>}

      {plan && (
        <Card>
            <CardHeader>
                <CardTitle>Your Personalized Study Plan</CardTitle>
                <CardDescription>Here's a day-by-day breakdown of what to study.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    {plan.dailyPlan.map((day, i) => (
                        <div key={i} className="p-4 border rounded-lg">
                            <h3 className="font-bold text-lg">Day {day.day}: <span className="font-normal text-muted-foreground">{day.date}</span></h3>
                            <ul className="mt-2 space-y-2 list-disc list-inside">
                                {day.tasks.map((task, j) => (
                                    <li key={j}>
                                        <span className="font-semibold">{task.taskName}</span> ({task.durationMinutes} mins):
                                        <p className="pl-5 text-muted-foreground text-sm">{task.description}</p>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
      )}
    </div>
  );
}
