"use client";

import { cn } from "@/lib/utils";

interface PillProps {
    label: string;
    selected: boolean;
    onClick: () => void;
}

export function Pill({ label, selected, onClick }: PillProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition-all",
                selected
                    ? "border-indigo-500 bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                    : "border-border bg-secondary/50 text-muted-foreground hover:border-indigo-500/50 hover:text-foreground"
            )}
        >
            {label}
        </button>
    );
}
