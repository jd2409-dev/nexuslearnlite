import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Crown, Trophy } from "lucide-react";

const leaderboardData = [
    { rank: 1, name: "Alex Ray", xp: 15200, avatar: "https://picsum.photos/seed/alex/40/40", imageHint: "person woman" },
    { rank: 2, name: "Jordan Lee", xp: 14800, avatar: "https://picsum.photos/seed/jordan/40/40", imageHint: "person man" },
    { rank: 3, name: "Casey Smith", xp: 13950, avatar: "https://picsum.photos/seed/casey/40/40", imageHint: "person face" },
    { rank: 4, name: "Morgan Taylor", xp: 13100, avatar: "https://picsum.photos/seed/morgan/40/40", imageHint: "person woman" },
    { rank: 15, name: "Student User", xp: 1250, avatar: "https://picsum.photos/seed/nexususer/40/40", imageHint: "person glasses", isCurrentUser: true },
    { rank: 5, name: "Riley Green", xp: 12500, avatar: "https://picsum.photos/seed/riley/40/40", imageHint: "person man" },
    { rank: 6, name: "Dakota Chen", xp: 11800, avatar: "https://picsum.photos/seed/dakota/40/40", imageHint: "person woman" },
].sort((a,b) => {
    if (a.isCurrentUser) return 1;
    if (b.isCurrentUser) return -1;
    return a.rank - b.rank;
});


export default function LeaderboardPage() {
    return (
        <div className="container mx-auto space-y-8">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight font-headline flex items-center gap-2"><Trophy className="text-accent"/> Leaderboard</h1>
                <p className="text-muted-foreground">See how you rank against other learners globally.</p>
            </div>
            <Card>
                <CardHeader>
                    <CardTitle>Top Learners</CardTitle>
                    <CardDescription>Rankings are based on total XP earned.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[80px]">Rank</TableHead>
                                <TableHead>User</TableHead>
                                <TableHead className="text-right">XP</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {leaderboardData.map(user => (
                                <TableRow key={user.rank} className={user.isCurrentUser ? 'bg-primary/10' : ''}>
                                    <TableCell className="font-bold text-lg">
                                        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-muted">
                                            {user.rank <= 3 ? <Crown className={`w-6 h-6 ${user.rank === 1 ? 'text-yellow-400' : user.rank === 2 ? 'text-gray-400' : 'text-yellow-700'}`}/> : user.rank}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar>
                                                <AvatarImage src={user.avatar} data-ai-hint={user.imageHint} />
                                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{user.name} {user.isCurrentUser && "(You)"}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right font-semibold text-accent">{user.xp.toLocaleString()} XP</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
