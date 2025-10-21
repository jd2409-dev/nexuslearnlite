
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { BarChart, TrendingUp, Sparkles, AlertCircle } from "lucide-react";
import { ResponsiveContainer, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const pastQuizzes = [
  { name: 'Physics Quiz 1', score: 65, date: '2024-07-10' },
  { name: 'Math Algebra', score: 88, date: '2024-07-12' },
  { name: 'Chemistry Basics', score: 72, date: '2024-07-15' },
  { name: 'Biology Cells', score: 55, date: '2024-07-18' },
];

const aiSuggestions = [
    "You seem to struggle with questions involving calculations in Physics. Try practicing more numerical problems.",
    "Your performance in Biology suggests a need to review cellular structures and their functions.",
    "Excellent work in Algebra! Keep up the practice to maintain your high scores.",
    "In Chemistry, focus on understanding the periodic table and element properties better."
];

export function ReflectionsClient() {
  return (
    <div className="container mx-auto space-y-8">
        <div className="mb-6">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Reflections</h1>
            <p className="text-muted-foreground">Review your past quiz results and get AI-powered insights.</p>
        </div>

        <Card>
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><BarChart/> Past Quiz Performance</CardTitle>
                <CardDescription>A summary of your recent quiz scores.</CardDescription>
            </CardHeader>
            <CardContent>
                {pastQuizzes.length > 0 ? (
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={pastQuizzes}>
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
                ) : (
                    <div className="text-center text-muted-foreground py-8">
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
                 <ul className="space-y-3 list-disc list-inside">
                    {aiSuggestions.map((suggestion, index) => (
                        <li key={index} className="flex items-start gap-3">
                            <TrendingUp className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                            <span>{suggestion}</span>
                        </li>
                    ))}
                </ul>
            </CardContent>
        </Card>
    </div>
  );
}
