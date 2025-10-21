import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

const subjects = [
    { id: 'physics', name: 'Physics', progress: 75, imageId: 'subject-physics' },
    { id: 'chemistry', name: 'Chemistry', progress: 40, imageId: 'subject-chemistry' },
    { id: 'biology', name: 'Biology', progress: 60, imageId: 'subject-biology' },
    { id: 'math', name: 'Mathematics', progress: 90, imageId: 'subject-math' },
    { id: 'history', name: 'History', progress: 25, imageId: 'subject-history' },
    { id: 'geography', name: 'Geography', progress: 55, imageId: 'subject-geography' },
];

export default function SubjectsPage() {
    return (
        <div className="container mx-auto space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Subjects</h1>
                <p className="text-muted-foreground">Choose a subject to start your learning journey.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {subjects.map(subject => {
                    const image = PlaceHolderImages.find(p => p.id === subject.imageId);
                    return (
                        <Link href={`/subjects/${subject.id}`} key={subject.id}>
                            <Card className="overflow-hidden group transition-all hover:shadow-lg hover:shadow-primary/20 hover:border-primary/50">
                                <CardContent className="p-0">
                                    <div className="relative h-40 w-full">
                                        {image && <Image src={image.imageUrl} alt={subject.name} fill style={{ objectFit: 'cover' }} className="group-hover:scale-105 transition-transform duration-300" data-ai-hint={image.imageHint} />}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                                        <h2 className="absolute bottom-4 left-4 text-2xl font-bold text-white font-headline">{subject.name}</h2>
                                    </div>
                                </CardContent>
                                <CardFooter className="p-4 flex-col items-start space-y-2">
                                    <div className="w-full">
                                        <p className="text-sm text-muted-foreground mb-1">Progress: {subject.progress}%</p>
                                        <Progress value={subject.progress} className="h-2" />
                                    </div>
                                    <div className="flex justify-end w-full">
                                        <span className="text-sm text-primary flex items-center">
                                            Continue Learning <ArrowRight className="ml-1 h-4 w-4" />
                                        </span>
                                    </div>
                                </CardFooter>
                            </Card>
                        </Link>
                    )
                })}
            </div>
        </div>
    );
}
