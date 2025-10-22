"use client";

import { useState, useEffect, useRef, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Play, Pause, RotateCcw } from 'lucide-react';

const WORK_MINUTES = 25;
const BREAK_MINUTES = 5;

export function PomodoroTimer() {
  const [mode, setMode] = useState<'work' | 'break'>('work');
  const [time, setTime] = useState(WORK_MINUTES * 60);
  const [isActive, setIsActive] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handleModeChange = (newMode: 'work' | 'break') => {
    setIsActive(false);
    setMode(newMode);
    setTime(newMode === 'work' ? WORK_MINUTES * 60 : BREAK_MINUTES * 60);
  };

  const resetTimer = useCallback(() => {
    setIsActive(false);
    setTime(mode === 'work' ? WORK_MINUTES * 60 : BREAK_MINUTES * 60);
  }, [mode]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive && time > 0) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (time === 0) {
      if (audioRef.current) {
        audioRef.current.play();
      }
      handleModeChange(mode === 'work' ? 'break' : 'work');
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, time, mode, handleModeChange]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60).toString().padStart(2, '0');
    const secs = (seconds % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="font-headline">Pomodoro Timer</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={mode} onValueChange={(value) => handleModeChange(value as 'work' | 'break')} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="work">Work</TabsTrigger>
            <TabsTrigger value="break">Break</TabsTrigger>
          </TabsList>
          <TabsContent value="work">
             <div className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="text-6xl font-bold font-mono text-primarytabular-nums tracking-widest">
                    {formatTime(time)}
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={() => setIsActive(!isActive)} size="icon" className="w-16 h-16 rounded-full">
                        {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    </Button>
                    <Button onClick={resetTimer} size="icon" variant="outline">
                        <RotateCcw />
                    </Button>
                </div>
            </div>
          </TabsContent>
          <TabsContent value="break">
            <div className="flex flex-col items-center justify-center p-6 space-y-4">
                <div className="text-6xl font-bold font-mono text-primary tabular-nums tracking-widest">
                    {formatTime(time)}
                </div>
                <div className="flex items-center gap-4">
                    <Button onClick={() => setIsActive(!isActive)} size="icon" className="w-16 h-16 rounded-full">
                        {isActive ? <Pause className="w-8 h-8" /> : <Play className="w-8 h-8" />}
                    </Button>
                    <Button onClick={resetTimer} size="icon" variant="outline">
                        <RotateCcw />
                    </Button>
                </div>
            </div>
          </TabsContent>
        </Tabs>
        <audio ref={audioRef} src="/sounds/timer-chime.mp3" preload="auto"></audio>
      </CardContent>
    </Card>
  );
}