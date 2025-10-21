"use client";

import { useState } from "react";
import { generateStudyNotes, GenerateStudyNotesOutput } from "@/ai/flows/generate-study-notes";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Wand2 } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

type StudyNotesClientProps = {
    subjectName: string;
};

export function StudyNotesClient({ subjectName }: StudyNotesClientProps) {
    const [notes, setNotes] = useState<GenerateStudyNotesOutput | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleGenerateNotes = async () => {
        setIsLoading(true);
        setNotes(null);
        try {
            const result = await generateStudyNotes({ subject: subjectName });
            setNotes(result);
        } catch (error) {
            console.error(error);
            setNotes({ notes: "Failed to generate study notes. Please try again." });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle>AI-Generated Study Notes</CardTitle>
                <CardDescription>Generate comprehensive notes for '{subjectName}' with one click.</CardDescription>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
                <Button onClick={handleGenerateNotes} disabled={isLoading} className="mb-4">
                    {isLoading ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Generating...</> : <><Wand2 className="mr-2 h-4 w-4" /> Generate Notes</>}
                </Button>
                <div className="flex-1 rounded-lg border bg-muted/50 p-4">
                    <ScrollArea className="h-full max-h-[500px] pr-4">
                        {isLoading && (
                            <div className="flex flex-col items-center justify-center h-full text-muted-foreground">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                                <p className="mt-4">AI is crafting your notes...</p>
                            </div>
                        )}
                        {notes ? (
                            <p className="text-sm whitespace-pre-wrap">{notes.notes}</p>
                        ) : (
                             !isLoading && <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-center p-8">
                                <Wand2 className="h-10 w-10 mb-4 text-primary" />
                                <h3 className="font-semibold">Generate your study guide</h3>
                                <p>Click the button to get AI-powered notes for {subjectName}.</p>
                            </div>
                        )}
                    </ScrollArea>
                </div>
            </CardContent>
        </Card>
    );
}
