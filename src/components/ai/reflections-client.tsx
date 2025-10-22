
"use client";

import { useState, useEffect } from "react";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, query, orderBy, limit } from "firebase/firestore";
import { generateReflections, GenerateReflectionsOutput } from "@/ai/flows/generate-reflections-flow";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { TrendingUp, Sparkles, AlertCircle, Loader2 } from "lucide-react";
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip, BarChart } from 'recharts';
import { useToast } from "@/hooks/use-toast";

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
};

export function ReflectionsClient() {
    const { user } = useUser();
    const firestore = useFirestore();
    const { toast } = useToast();

    const [aiSuggestions, setAiSuggestions] = useState<string[]>([]);
    const [isGenerating, setIsGenerating] = useState(false);

    const quizResultsRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'quizResults');
    }, [firestore, user]);

    const quizResultsQuery = useMemoFirebase(() => {
        if (!quizResultsRef) return null;
        return query(quizResultsRef, orderBy('takenAt', 'desc'), limit(10));
    }, [quizResultsRef]);

    const { data: pastQuizzes, isLoading: isLoadingQuizzes } = useCollection<QuizResult>(quizResultsQuery);

    useEffect(() => {
        if (pastQuizzes && pastQuizzes.length > 0 && !isGenerating) {
            const getReflections = async () => {
                setIsGenerating(true);
                try {
                    const result: GenerateReflectionsOutput = await generateReflections({
                        quizHistory: pastQuizzes.map(q => ({
                            quizTitle: q.quizTitle,
                            score: q.score,
                            questions: q.questions,
                        })),
                    });
                    setAiSuggestions(result.suggestions);
                } catch (error) {
                    console.error("Error generating reflections:", error);
                    toast({
                        variant: "destructive",
                        title: "Could not generate AI insights",
                        description: "There was an error while analyzing your quiz results."
                    });
                } finally {
                    setIsGenerating(false);
                }
            };
            getReflections();
        }
    }, [pastQuizzes, isGenerating, toast]);

    const chartData = pastQuizzes?.map(q => ({ name: q.quizTitle, score: q.score })).reverse() || [];

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
                                <BarChart data={chartData}>
                                    <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                                    <Tooltip
                                        contentStyle={{
                                            background: "hsl(var(--background))",
                                            border: "1px solid hsl(var(--border))"
                                        }}
                                    />
                                    <Bar dataKey="score" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                                </BarChart>
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
                    <CardDescription>Personalized tips to help you improve your scores.</CardDescription>
                </CardHeader>
                <CardContent>
                    {(isLoadingQuizzes || isGenerating) && (
                         <div className="flex items-center gap-3 text-muted-foreground">
                            <Loader2 className="h-5 w-5 animate-spin" />
                            <span>Generating insights based on your performance...</span>
                         </div>
                    )}

                    {!isGenerating && !isLoadingQuizzes && aiSuggestions.length > 0 && (
                        <ul className="space-y-3 list-disc list-inside">
                            {aiSuggestions.map((suggestion, index) => (
                                <li key={index} className="flex items-start gap-3">
                                    <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                                    <span>{suggestion}</span>
                                </li>
                            ))}
                        </ul>
                    )}

                    {!isGenerating && !isLoadingQuizzes && pastQuizzes && pastQuizzes.length > 0 && aiSuggestions.length === 0 && (
                        <div className="text-center text-muted-foreground py-4">
                            <p>Could not generate AI suggestions at this time.</p>
                        </div>
                    )}
                    
                    {!isLoadingQuizzes && (!pastQuizzes || pastQuizzes.length === 0) && (
                         <div className="text-center text-muted-foreground py-4">
                            <p>Complete a quiz to get personalized feedback.</p>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
