"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { LogOut, User } from "lucide-react";

interface TopBarProps {
    email: string;
    usageCount: number;
}

export function TopBar({ email, usageCount }: TopBarProps) {
    const router = useRouter();
    const supabase = createClient();
    const initials = email.slice(0, 2).toUpperCase();

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/30 px-6">
            <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">
                    {usageCount}
                </span>{" "}
                scripts generated
            </div>
            <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center gap-2 rounded-lg px-2 py-1.5 outline-none hover:bg-secondary">
                    <Avatar className="h-8 w-8">
                        <AvatarFallback className="bg-indigo-600 text-xs text-white">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <span className="hidden text-sm sm:inline">{email}</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem disabled>
                        <User className="mr-2 h-4 w-4" />
                        {email}
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </header>
    );
}
