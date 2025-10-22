
"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Video, StopCircle, Download, Loader2, Book } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { useUser, useFirestore, useCollection, useMemoFirebase } from "@/firebase";
import { collection, addDoc, serverTimestamp, query, orderBy } from "firebase/firestore";
import { getStorage, ref as storageRef, uploadBytes, getDownloadURL } from "firebase/storage";
import { format } from 'date-fns';

type JournalEntry = {
    id: string;
    text: string;
    createdAt: {
        seconds: number;
        nanoseconds: number;
    } | Date;
    videoUrl?: string;
};

export function LearningJournalClient() {
    const [isRecording, setIsRecording] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [hasPermission, setHasPermission] = useState<boolean | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const recordedChunksRef = useRef<Blob[]>([]);
    
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

    const getPermissions = useCallback(async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
            setHasPermission(true);
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error('Error accessing media devices:', error);
            setHasPermission(false);
            toast({
                variant: 'destructive',
                title: 'Permissions Denied',
                description: 'Please enable camera and microphone permissions in your browser settings.',
            });
        }
    }, [toast]);
    
    useEffect(() => {
        getPermissions();
    }, [getPermissions]);

    const handleStartRecording = async () => {
        if (!videoRef.current?.srcObject) {
            await getPermissions();
            if (!videoRef.current?.srcObject) return;
        }

        const stream = videoRef.current.srcObject as MediaStream;
        mediaRecorderRef.current = new MediaRecorder(stream);
        
        mediaRecorderRef.current.ondataavailable = (event) => {
            if (event.data.size > 0) {
                recordedChunksRef.current.push(event.data);
            }
        };

        mediaRecorderRef.current.onstop = async () => {
            setIsSaving(true);
            const blob = new Blob(recordedChunksRef.current, { type: "video/webm" });
            recordedChunksRef.current = [];

            if (!user || !firestore) {
                toast({ variant: 'destructive', title: 'You must be logged in to save an entry.' });
                setIsSaving(false);
                return;
            }
            
            try {
                // Upload to Firebase Storage
                const storage = getStorage();
                const videoId = `${Date.now()}.webm`;
                const sRef = storageRef(storage, `users/${user.uid}/journalEntries/${videoId}`);
                const snapshot = await uploadBytes(sRef, blob);
                const downloadURL = await getDownloadURL(snapshot.ref);

                // Save reference to Firestore
                await addDoc(journalEntriesRef, {
                    userId: user.uid,
                    text: `Video Note - ${format(new Date(), 'PPP')}`,
                    createdAt: serverTimestamp(),
                    videoUrl: downloadURL,
                });

                toast({ title: 'Video journal entry saved!' });
            } catch (error) {
                console.error("Error saving entry: ", error);
                toast({ variant: 'destructive', title: 'Failed to save video entry.' });
            } finally {
                setIsSaving(false);
                // Restart preview stream
                getPermissions();
            }
        };
        
        recordedChunksRef.current = [];
        mediaRecorderRef.current.start();
        setIsRecording(true);
    };

    const handleStopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            setIsRecording(false);
        }
        const stream = videoRef.current?.srcObject as MediaStream;
        stream?.getTracks().forEach(track => track.stop());
    };

    const handleDownload = (url: string) => {
        const a = document.createElement('a');
        a.href = url;
        a.download = `nexuslearn-entry-${new Date().toISOString()}.webm`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    return (
        <div className="container mx-auto space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Learning Journal</h1>
                <p className="text-muted-foreground">Record video notes to capture your thoughts and learnings.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>New Video Entry</CardTitle>
                    <CardDescription>Click the button below to start recording your video and audio.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="aspect-video w-full bg-muted rounded-md overflow-hidden flex items-center justify-center">
                        <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
                    </div>
                    {hasPermission === false && (
                        <Alert variant="destructive" className="mt-4">
                            <AlertTitle>Camera & Mic Access Denied</AlertTitle>
                            <AlertDescription>
                            Please enable camera and microphone permissions in your browser settings to use this feature.
                            </AlertDescription>
                        </Alert>
                    )}
                     <div className="flex items-center justify-center gap-2">
                        {!isRecording ? (
                            <Button onClick={handleStartRecording} size="lg" disabled={isSaving || hasPermission === false}>
                                <Video className="mr-2 h-4 w-4" /> Start Recording
                            </Button>
                        ) : (
                            <Button onClick={handleStopRecording} size="lg" variant="destructive" disabled={isSaving}>
                                {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <StopCircle className="mr-2 h-4 w-4" />}
                                {isSaving ? "Saving..." : "Stop Recording"}
                            </Button>
                        )}
                    </div>
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
                            <p className="text-sm">Create a video entry above to get started.</p>
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
                                {entry.videoUrl ? (
                                     <div className="space-y-2">
                                        <video src={entry.videoUrl} controls className="w-full rounded-md max-w-lg"></video>
                                        <Button onClick={() => handleDownload(entry.videoUrl!)} variant="outline" size="sm">
                                            <Download className="mr-2 h-4 w-4" />
                                            Download
                                        </Button>
                                    </div>
                                ) : (
                                    <p className="whitespace-pre-wrap">{entry.text}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
