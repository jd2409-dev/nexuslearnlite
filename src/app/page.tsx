import { Button } from "@/components/ui/button";
import { GraduationCap, Zap, Trophy, Bot } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
    <main className="flex-grow flex flex-col items-center justify-center p-8 bg-background text-center">
      <div className="flex flex-col items-center max-w-3xl">
        <div className="flex items-center gap-4 mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary"><path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"/><path d="m15.5 15.5-7-7"/><path d="m8.5 15.5 7-7"/></svg>
            <h1 className="text-5xl md:text-6xl font-headline font-bold">NexusLearn Lite</h1>
        </div>
        <p className="text-lg text-muted-foreground mb-8">
            The future of learning is here. NexusLearn Lite is a fully gamified, AI-driven academic assistant designed to make studying engaging, effective, and fun.
        </p>
        
        <div className="grid md:grid-cols-3 gap-6 my-12 text-left">
            <div className="flex flex-col items-center p-6 rounded-lg">
                <Bot className="h-10 w-10 mb-4 text-primary"/>
                <h3 className="text-xl font-semibold font-headline mb-2">AI-Powered Tools</h3>
                <p className="text-muted-foreground text-sm text-center">Get instant homework help, generate mock exams, and ask questions about your textbooks with our suite of AI features.</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg">
                <Zap className="h-10 w-10 mb-4 text-accent"/>
                <h3 className="text-xl font-semibold font-headline mb-2">Gamified Learning</h3>
                <p className="text-muted-foreground text-sm text-center">Earn experience points (XP), collect coins, and unlock achievements as you master new subjects and complete study goals.</p>
            </div>
            <div className="flex flex-col items-center p-6 rounded-lg">
                <Trophy className="h-10 w-10 mb-4 text-primary"/>
                <h3 className="text-xl font-semibold font-headline mb-2">Compete & Climb</h3>
                <p className="text-muted-foreground text-sm text-center">See how you stack up against other learners on the global leaderboard and strive for the top spot.</p>
            </div>
        </div>

        <p className="text-lg text-foreground mb-8">
            Ready to revolutionize your study sessions?
        </p>

        <div className="flex gap-4">
          <Button asChild size="lg">
            <Link href="/login">Log In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/signup">Sign Up for Free</Link>
          </Button>
        </div>
      </div>
    </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Built by JD Vinod</p>
        <p>For support, contact nexuslearnlite@gmail.com</p>
      </footer>
    </div>
  );
}
