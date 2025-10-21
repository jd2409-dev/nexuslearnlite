
"use client";

import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, FileQuestion, GraduationCap, ArrowRight, Zap, Coins, PlusCircle, BookOpen } from "lucide-react";
import Link from 'next/link';
import { useState, useEffect } from 'react';

const quickAccessItems = [
  { href: "/ai-tutor", label: "AI Tutor", icon: Bot, description: "Get instant homework help." },
  { href: "/exam-prep", label: "Mock Exams", icon: FileQuestion, description: "Test your knowledge." },
  { href: "/textbook-ai", label: "Textbook AI", icon: GraduationCap, description: "Upload and ask questions." },
];

export default function DashboardPage() {
  const [xp, setXp] = useState(1250);
  const [studyGoals, setStudyGoals] = useState([]);

  useEffect(() => {
    const startDate = new Date('2024-01-01');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setXp(1250 + diffDays);
  }, []);

  return (
    <div className="container mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back, Student!</h1>
        <p className="text-muted-foreground">Here's your personalized study hub. Let's make today productive.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Experience Points</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">{xp.toLocaleString()} XP</div>
            <p className="text-xs text-muted-foreground">Level 5</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Coins Earned</CardTitle>
            <Coins className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">500</div>
            <p className="text-xs text-muted-foreground">+20 this week</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader className="flex items-center justify-between">
              <div>
                <CardTitle className="font-headline">Daily Study Goals</CardTitle>
                <CardDescription>Your tasks for today.</CardDescription>
              </div>
              <Button variant="outline" size="sm"><PlusCircle className="mr-2 h-4 w-4" /> Add Goal</Button>
            </CardHeader>
            <CardContent className="space-y-4">
              {studyGoals.length === 0 ? (
                <div className="text-center text-muted-foreground py-8">
                  <BookOpen className="mx-auto h-10 w-10 mb-4" />
                  <p>No study goals set for today.</p>
                  <p className="text-sm">Click "Add Goal" to plan your session.</p>
                </div>
              ) : (
                <>
                  {/* Map through study goals here */}
                </>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Quick Access</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
              {quickAccessItems.map(item => (
                <Link key={item.href} href={item.href} className="flex flex-col items-center justify-center p-4 text-center rounded-lg bg-card/50 hover:bg-muted/80 transition-colors group">
                    <item.icon className="h-8 w-8 mb-2 text-primary group-hover:scale-110 transition-transform" />
                    <span className="font-semibold text-sm">{item.label}</span>
                    <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
