
"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Mic, MicOff, Video, VideoOff, Save, Loader2, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { format } from 'date-fns';

type JournalEntry = {
    id: string;
    text: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | Date;
};

export function LearningJournalClient() {
    const [text, setText] = useState("");
    const [isRecording, setIsRecording] = useState(false);
    const [isCameraOn, setIsCameraOn] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
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

    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = true;
            recognitionRef.current.onresult = (event: any) => {
                let finalTranscript = '';
                for (let i = event.resultIndex; i < event.results.length; ++i) {
                    if (event.results[i].isFinal) {
                        finalTranscript += event.results[i][0].transcript;
                    }
                }
                if (finalTranscript) {
                    setText(prev => prev.trim() + ' ' + finalTranscript.trim());
                }
            };
        }
    }, []);

    const toggleRecording = () => {
        if (!recognitionRef.current) {
            toast({ variant: "destructive", title: "Speech recognition not supported in your browser."});
            return;
        }
        if (isRecording) {
            recognitionRef.current.stop();
            setIsRecording(false);
        } else {
            recognitionRef.current.start();
            setIsRecording(true);
        }
    };
    
    useEffect(() => {
        const getCameraPermission = async () => {
          try {
            const stream = await navigator.mediaDevices.getUserMedia({video: true});
            setHasCameraPermission(true);
    
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings to use this feature.',
            });
          }
        };
    
        if (isCameraOn) {
            getCameraPermission();
        } else {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject as MediaStream;
                stream.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
        }
    }, [isCameraOn, toast]);


    const toggleCamera = () => {
        setIsCameraOn(prev => !prev);
    };
    
    const handleSaveEntry = async () => {
        if (!user) {
            toast({ variant: 'destructive', title: 'You must be logged in to save an entry.' });
            return;
        }
        if (!text.trim()) {
            toast({ variant: 'destructive', title: 'Cannot save an empty entry.' });
            return;
        }
        if (!journalEntriesRef) return;

        setIsSaving(true);
        try {
            await addDoc(journalEntriesRef, {
                userId: user.uid,
                text: text,
                createdAt: serverTimestamp(),
            });
            setText("");
            toast({ title: 'Journal entry saved!' });
        } catch (error) {
            console.error("Error saving entry: ", error);
            toast({ variant: 'destructive', title: 'Failed to save entry.' });
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="container mx-auto space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Learning Journal</h1>
                <p className="text-muted-foreground">Record your notes by typing, speaking, or showing content on camera.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>New Journal Entry</CardTitle>
                    <CardDescription>Capture your thoughts and learnings for future reference.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <Textarea 
                            placeholder="Start typing your notes here..."
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            rows={10}
                            className="text-base"
                        />
                         <div className="flex items-center gap-2">
                            <Button onClick={toggleRecording} variant={isRecording ? "destructive" : "outline"} size="icon" aria-label="Toggle voice recording">
                                {isRecording ? <MicOff /> : <Mic />}
                            </Button>
                             <Button onClick={toggleCamera} variant={isCameraOn ? "destructive" : "outline"} size="icon" aria-label="Toggle camera">
                                {isCameraOn ? <VideoOff /> : <Video />}
                            </Button>
                            <Button onClick={handleSaveEntry} disabled={isSaving} className="ml-auto">
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                 Save Entry
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {isCameraOn && (
                <Card>
                    <CardHeader>
                        <CardTitle>Camera View</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="aspect-video w-full bg-muted rounded-md overflow-hidden flex items-center justify-center">
                            <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                        </div>
                        {hasCameraPermission === false && (
                            <Alert variant="destructive" className="mt-4">
                                <AlertTitle>Camera Access Denied</AlertTitle>
                                <AlertDescription>
                                Please enable camera permissions in your browser settings to use this feature.
                                </AlertDescription>
                            </Alert>
                        )}
                    </CardContent>
                </Card>
            )}

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
                            <p className="text-sm">Create an entry above to get started.</p>
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

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}
