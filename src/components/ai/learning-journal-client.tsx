
"use client";

import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Book, FileText, Send } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { format } from 'date-fns';
import { Textarea } from "@/components/ui/textarea";

type JournalEntry = {
    id: string;
    text: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | Date;
};

export function LearningJournalClient() {
    const [isSaving, setIsSaving] = useState(false);
    const [textNote, setTextNote] = useState("");
    
    const { toast } = useToast();
    const { user } = useUser();
    const firestore = useFirestore();

    const journalEntriesRef = useMemoFirebase(() => {
        if (!user || !firestore) return null;
        return collection(firestore, 'users', user.uid, 'journalEntries');
    }, [firestore, user]);

    const journalEntriesQuery = useMemoFirebase(() => {
        if (!journalEntriesRef) return null;
        return query(journalEntriesRef, orderBy('createdAt', 'desc'));
    }, [journalEntriesRef]);
    
    const { data: entries, isLoading: isLoadingEntries } = useCollection<JournalEntry>(journalEntriesQuery);

    const handleSaveTextNote = async () => {
        if (!textNote.trim()) {
            toast({ variant: 'destructive', title: 'Note cannot be empty.' });
            return;
        }
        if (!user || !firestore || !journalEntriesRef) {
            toast({ variant: 'destructive', title: 'You must be logged in to save a note.' });
            return;
        }

        setIsSaving(true);
        try {
            await addDoc(journalEntriesRef, {
                userId: user.uid,
                text: textNote,
                createdAt: serverTimestamp(),
            });
            toast({ title: 'Note saved!' });
            setTextNote("");
        } catch (error) {
            console.error("Error saving note: ", error);
            toast({ variant: 'destructive', title: 'Failed to save note.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Learning Journal</h1>
                <p className="text-muted-foreground">Record text notes to capture your thoughts and learnings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2"><FileText className="h-5 w-5" />New Text Note</CardTitle>
                    <CardDescription>Write down your thoughts, summaries, or questions.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <Textarea
                        placeholder="Start typing your notes here..."
                        rows={8}
                        value={textNote}
                        onChange={(e) => setTextNote(e.target.value)}
                        disabled={isSaving}
                        className="text-base"
                    />
                    <Button onClick={handleSaveTextNote} disabled={isSaving || !textNote.trim()}>
                        {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                        Save Note
                    </Button>
                </CardContent>
            </Card>


            <Card>
                <CardHeader>
                    <CardTitle>Past Entries</CardTitle>
                    <CardDescription>Review your previous journal entries.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoadingEntries && <div className="flex justify-center items-center h-24"><Loader2 className="h-8 w-8 animate-spin text-primary" /></div>}
                    {!isLoadingEntries && (!entries || entries.length === 0) && (
                        <div className="text-center text-muted-foreground py-8">
                            <Book className="mx-auto h-10 w-10 mb-4" />
                            <p>No journal entries yet.</p>
                            <p className="text-sm">Create a text entry above to get started.</p>
                        </div>
                    )}
                    <div className="space-y-4">
                        {entries?.map(entry => (
                            <div key={entry.id} className="border-l-4 border-primary pl-4 py-2">
                                <p className="text-sm text-muted-foreground mb-2">
                                    {entry.createdAt instanceof Date 
                                        ? format(entry.createdAt, 'PPP p')
                                        : entry.createdAt?.seconds 
                                            ? format(new Date(entry.createdAt.seconds * 1000), 'PPP p') 
                                            : 'Date not available'}
                                </p>
                                <p className="whitespace-pre-wrap">{entry.text}</p>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
