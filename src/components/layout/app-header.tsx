"use client";

import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Award, BarChart, Coins, LogOut, User, Zap } from "lucide-react";
import Link from 'next/link';

export function AppHeader() {
  const { isMobile } = useSidebar();

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm md:px-6">
      {isMobile && <SidebarTrigger />}
      <div className="flex-1">
      </div>
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm font-semibold text-accent">
          <Zap className="h-5 w-5 fill-current" />
          <span>1,250 XP</span>
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
                <p className="text-sm font-medium leading-none">Student User</p>
                <p className="text-xs leading-none text-muted-foreground">
                  student@nexus.com
                </p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Award className="mr-2 h-4 w-4" />
              <span>Achievements</span>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <BarChart className="mr-2 h-4 w-4" />
              <span>My Stats</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
                <Link href="/login">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
