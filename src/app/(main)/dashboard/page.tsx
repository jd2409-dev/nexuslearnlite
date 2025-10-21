import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bot, FileQuestion, GraduationCap, Trophy, ArrowRight, Zap, Coins, Star, BookOpen } from "lucide-react";
import Link from 'next/link';

const quickAccessItems = [
  { href: "/ai-tutor", label: "AI Tutor", icon: Bot, description: "Get instant homework help." },
  { href: "/exam-prep", label: "Mock Exams", icon: FileQuestion, description: "Test your knowledge." },
  { href: "/textbook-ai", label: "Textbook AI", icon: GraduationCap, description: "Upload and ask questions." },
  { href: "/leaderboard", label: "Leaderboard", icon: Trophy, description: "See where you rank." },
];

export default function DashboardPage() {
  return (
    <div className="container mx-auto space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome back, Student!</h1>
        <p className="text-muted-foreground">Here's your personalized study hub. Let's make today productive.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Experience Points</CardTitle>
            <Zap className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-accent">1,250 XP</div>
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
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Star className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 / 50</div>
            <p className="text-xs text-muted-foreground">"Quiz Master" unlocked!</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-8 lg:grid-cols-5">
        <div className="lg:col-span-3 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="font-headline">Daily Study Goals</CardTitle>
              <CardDescription>Your AI-powered recommendations for today.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/50 transition-colors">
                <div className="p-3 bg-primary/10 rounded-full">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Review Physics: Chapter 3</h3>
                  <p className="text-sm text-muted-foreground">Focus on electromagnetism. Your last quiz showed this is a weak area.</p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                  <Link href="/subjects/physics"><ArrowRight /></Link>
                </Button>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-card/50 transition-colors">
                 <div className="p-3 bg-primary/10 rounded-full">
                  <FileQuestion className="h-6 w-6 text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold">Take a 10-question Math Quiz</h3>
                  <p className="text-sm text-muted-foreground">Strengthen your algebra skills and earn 50 XP.</p>
                </div>
                <Button variant="ghost" size="icon" asChild>
                   <Link href="/exam-prep"><ArrowRight /></Link>
                </Button>
              </div>
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
