
"use client";

import { useMemo } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TrendingUp, Sparkles, AlertCircle, Loader2, BarChart, FileQuestion, CheckCircle } from "lucide-react";
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, BarChart as RechartsBarChart } from 'recharts';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

type AISuggestion = {
    observation: string;
    suggestion: string;
    example: string;
}

type QuizResult = {
    id: string;
    quizTitle: string;
    score: number;
    questions: {
        questionText: string;
        userAnswer: string;
        correctAnswer: string;
    }[];
    takenAt: {
        seconds: number;
        nanoseconds: number;
    } | Date;
    aiSuggestions?: AISuggestion[];
};

export function ReflectionsClient() {
    const { user } = useUser();
    const firestore = useFirestore();

    const quizResultsRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'quizResults');
    }, [firestore, user]);

    const quizResultsQuery = useMemoFirebase(() => {
        if (!quizResultsRef) return null;
        return query(quizResultsRef, orderBy('takenAt', 'desc'), limit(10));
    }, [quizResultsRef]);

    const { data: pastQuizzes, isLoading: isLoadingQuizzes } = useCollection<QuizResult>(quizResultsQuery);

    const chartData = useMemo(() => pastQuizzes?.map(q => ({ name: q.quizTitle, score: q.score })).reverse() || [], [pastQuizzes]);
    const latestSuggestions = useMemo(() => pastQuizzes?.[0]?.aiSuggestions || [], [pastQuizzes]);

    return (
        <div className="container mx-auto space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Reflections</h1>
                <p className="text-muted-foreground">Review your past quiz results and get AI-powered insights.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><BarChart className="h-5 w-5 text-muted-foreground" /> Past Quiz Performance</CardTitle>
                    <CardDescription>A summary of your recent quiz scores.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingQuizzes && (
                        <div className="flex justify-center items-center h-[300px]"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>
                    )}
                    {!isLoadingQuizzes && chartData.length > 0 ? (
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <RechartsBarChart data={chartData}>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            background: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))"
                                        }}
                                    />
                                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </RechartsBarChart>
                            </ResponsiveContainer>
                        </div>
                    ) : !isLoadingQuizzes && (
                        <div className="text-center text-muted-foreground py-8 h-[300px] flex flex-col justify-center items-center">
                            <AlertCircle className="mx-auto h-10 w-10 mb-4" />
                            <p>No quiz results yet.</p>
                            <p className="text-sm">Complete some quizzes to see your progress here.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
            
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><Sparkles className="text-accent" /> AI Insights & Suggestions</CardTitle>
                    <CardDescription>Personalized tips from your last quiz to help you improve.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingQuizzes && (
                         <div className="flex items-center gap-3 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Loading latest insights...</span>
                         </div>
                    )}

                    {!isLoadingQuizzes && latestSuggestions.length > 0 && (
                        <Accordion type="single" collapsible className="w-full">
                            {latestSuggestions.map((item, index) => (
                                <AccordionItem value={`item-${index}`} key={index}>
                                    <AccordionTrigger className="text-left hover:no-underline">
                                        <div className="flex items-start gap-3">
                                            <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                            <span className="font-semibold">{item.observation}</span>
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="space-y-4 pl-8">
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                             <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-1" />
                                             <p><span className="font-semibold text-foreground">What to do:</span> {item.suggestion}</p>
                                        </div>
                                        <div className="flex items-start gap-3 text-muted-foreground">
                                            <FileQuestion className="h-5 w-5 text-blue-500 flex-shrink-0 mt-1" />
                                            <p><span className="font-semibold text-foreground">Example from your quiz:</span> "{item.example}"</p>
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    )}
                    
                    {!isLoadingQuizzes && (!pastQuizzes || pastQuizzes.length === 0 || latestSuggestions.length === 0) && (
                         <div className="text-center text-muted-foreground py-8">
                             <AlertCircle className="mx-auto h-10 w-10 mb-4" />
                            <p>No AI suggestions available.</p>
                            <p className="text-sm">Complete a quiz to get personalized feedback.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

    