import { StudyNotesClient } from "@/components/ai/study-notes-client";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

// Mock data, in a real app this would come from a database
const subjectData: { [key: string]: any } = {
    physics: { 
        name: "Physics", 
        chapters: [
            { name: "Chapter 1: Kinematics", completed: true },
            { name: "Chapter 2: Laws of Motion", completed: true },
            { name: "Chapter 3: Electromagnetism", completed: false },
            { name: "Chapter 4: Optics", completed: false },
        ]
    },
    math: { 
        name: "Mathematics",
        chapters: [
            { name: "Chapter 1: Algebra", completed: true },
            { name: "Chapter 2: Calculus", completed: false },
            { name: "Chapter 3: Trigonometry", completed: false },
        ]
    },
    // Add other subjects as needed
};

export default function SubjectDetailPage({ params }: { params: { id: string } }) {
    const subject = subjectData[params.id] || { name: "Subject", chapters: [] };

    return (
        <div className="container mx-auto space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">{subject.name}</h1>
                <p className="text-muted-foreground">Your personalized study path and AI tools for {subject.name}.</p>
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                    <Card>
                        <CardHeader>
                            <CardTitle>Study Path</CardTitle>
                            <CardDescription>Follow your curriculum-aligned path to mastery.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Accordion type="single" collapsible defaultValue="item-0">
                                {subject.chapters.map((chapter: any, index: number) => (
                                    <AccordionItem value={`item-${index}`} key={index}>
                                        <AccordionTrigger className="hover:no-underline">
                                            <div className="flex items-center gap-3">
                                                <CheckCircle className={`h-5 w-5 ${chapter.completed ? 'text-primary' : 'text-muted-foreground'}`} />
                                                <span className="text-left">{chapter.name}</span>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pl-10 space-y-2">
                                            <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary">Interactive Summary</p>
                                            <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary">Practice Quiz</p>
                                            <p className="text-sm text-muted-foreground cursor-pointer hover:text-primary">Flashcards</p>
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        </CardContent>
                    </Card>
                </div>
                <div className="lg:col-span-2">
                    <StudyNotesClient subjectName={subject.name} />
                </div>
            </div>
        </div>
    );
}
