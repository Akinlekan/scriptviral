"use client";

import { Badge } from "@/components/ui/badge";

interface TopBarProps {
    usageCount: number;
}

export function TopBar({ usageCount }: TopBarProps) {
    return (
        <header className="flex h-16 items-center justify-between border-b border-border bg-card/30 px-6">
            <div className="text-sm text-muted-foreground">
                <span className="font-medium text-foreground">{usageCount}</span>{" "}
                scripts generated
            </div>
            <Badge
                variant="secondary"
                className="border-indigo-500/30 bg-indigo-600/10 text-indigo-400"
            >
                Free · No signup required
            </Badge>
        </header>
    );
}
