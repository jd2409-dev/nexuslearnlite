
"use client";

import { useState, useEffect } from 'react';
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { BarChart, Coins, LogOut, User, Zap } from "lucide-react";
import Link from 'next/link';
import { useAuth, useUser } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';

export function AppHeader() {
  const { isMobile } = useSidebar();
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const router = useRouter();

  const [xp, setXp] = useState(1250);

  useEffect(() => {
    const startDate = new Date('2024-01-01');
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - startDate.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    setXp(1250 + diffDays);
  }, []);

  const handleLogout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {isMobile && <SidebarTrigger />}
      <div className="flex-1">
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-accent">
          <Zap className="h-5 w-5 fill-current" />
          <span>{xp.toLocaleString()} XP</span>
        </div>
        <div className="flex items-center gap-2 text-sm font-semibold text-accent">
          <Coins className="h-5 w-5" />
          <span>500</span>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
              <Avatar className="h-10 w-10">
                <AvatarFallback>
                  <User />
                </AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end">
            <DropdownMenuLabel className="font-normal">
              <div className="flex flex-col space-y-1">
                {isUserLoading ? (
                  <p className="text-sm">Loading...</p>
                ) : user ? (
                  <>
                    <p className="text-sm font-medium leading-none">{user.displayName || "Student"}</p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {user.email}
                    </p>
                  </>
                ) : (
                  <p className="text-sm">Not logged in</p>
                )}
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BarChart className="mr-2 h-4 w-4" />
              <span>My Stats</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
