"use client";

import { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { aiTutorHomeworkHelp, AiTutorHomeworkHelpOutput } from "@/ai/flows/ai-tutor-homework-help";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Bot, User, CornerDownLeft, Loader2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

const formSchema = z.object({
  query: z.string().min(1, { message: "Please enter a question." }),
});

type Message = {
  isUser: boolean;
  text: string;
};

export function AITutorClient() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { query: "" },
  });

  useEffect(() => {
    if (scrollAreaRef.current) {
        scrollAreaRef.current.scrollTo({ top: scrollAreaRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [messages]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    setMessages(prev => [...prev, { isUser: true, text: values.query }]);
    form.reset();

    try {
      const result: AiTutorHomeworkHelpOutput = await aiTutorHomeworkHelp({ query: values.query });
      setMessages(prev => [...prev, { isUser: false, text: result.answer }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { isUser: false, text: "Sorry, I encountered an error. Please try again." }]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="h-full flex flex-col container mx-auto">
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">AI Tutor</h1>
            <p className="text-muted-foreground">Get instant help with your questions and homework.</p>
        </div>
        <Card className="flex-1 flex flex-col">
            <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden p-4 md:p-6">
                <ScrollArea className="flex-1 pr-4 -mr-4" ref={scrollAreaRef}>
                    <div className="space-y-6">
                    {messages.length === 0 && !isLoading && (
                        <div className="text-center text-muted-foreground pt-16">
                            <Bot className="mx-auto h-12 w-12 mb-4" />
                            <h2 className="text-lg font-semibold">Ask me anything!</h2>
                            <p>For example: "Explain the process of photosynthesis."</p>
                        </div>
                    )}
                    {messages.map((message, index) => (
                        <div key={index} className={`flex items-start gap-3 ${message.isUser ? "justify-end" : ""}`}>
                        {!message.isUser && (
                            <Avatar className="border">
                            <AvatarFallback className="bg-transparent"><Bot /></AvatarFallback>
                            </Avatar>
                        )}
                        <div className={`rounded-lg px-4 py-3 max-w-xl shadow-sm ${message.isUser ? "bg-primary text-primary-foreground" : "bg-muted"}`}>
                            <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                        </div>
                        {message.isUser && (
                            <Avatar className="border">
                            <AvatarFallback className="bg-transparent"><User /></AvatarFallback>
                            </Avatar>
                        )}
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex items-start gap-3">
                            <Avatar className="border">
                                <AvatarFallback className="bg-transparent"><Bot /></AvatarFallback>
                            </Avatar>
                            <div className="rounded-lg px-4 py-3 bg-muted flex items-center shadow-sm">
                                <Loader2 className="h-5 w-5 animate-spin text-primary" />
                            </div>
                        </div>
                    )}
                    </div>
                </ScrollArea>
                <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="flex items-center gap-2 pt-4 border-t">
                    <FormField
                    control={form.control}
                    name="query"
                    render={({ field }) => (
                        <FormItem className="flex-1">
                        <FormControl>
                            <Input
                            placeholder="e.g., Explain Newton's First Law of Motion"
                            {...field}
                            disabled={isLoading}
                            className="text-base"
                            />
                        </FormControl>
                        </FormItem>
                    )}
                    />
                    <Button type="submit" size="icon" disabled={isLoading}>
                    {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CornerDownLeft className="h-4 w-4" />}
                    </Button>
                </form>
                </Form>
            </CardContent>
        </Card>
    </div>
  );
}
