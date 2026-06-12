"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ScriptOutput } from "@/components/dashboard/script-output";
import { getScriptById, savedScriptToGenerated } from "@/lib/local-storage";
import type { Genre, Platform, Tone } from "@/types";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SavedScriptViewProps {
    scriptId: string;
}

export function SavedScriptView({ scriptId }: SavedScriptViewProps) {
    const [ready, setReady] = useState(false);
    const [notFound, setNotFound] = useState(false);
    const [script, setScript] = useState<ReturnType<typeof getScriptById>>(null);

    useEffect(() => {
        const found = getScriptById(scriptId);
        if (!found) {
            setNotFound(true);
        } else {
            setScript(found);
            document.title = `${found.title} — ScriptViral`;
        }
        setReady(true);
    }, [scriptId]);

    if (!ready) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-background">
                <p className="text-muted-foreground">Loading script…</p>
            </div>
        );
    }

    if (notFound || !script) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4">
                <p className="text-lg font-medium">Script not found</p>
                <p className="text-sm text-muted-foreground">
                    It may have been deleted or saved in a different browser.
                </p>
                <Link
                    href="/dashboard/saved"
                    className={cn(buttonVariants(), "bg-indigo-600 hover:bg-indigo-700")}
                >
                    Back to saved scripts
                </Link>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur">
                <div className="mx-auto flex max-w-3xl items-center gap-3 px-6 py-4">
                    <Link
                        href="/dashboard/saved"
                        className={cn(
                            buttonVariants({ variant: "ghost", size: "sm" })
                        )}
                    >
                        <ArrowLeft className="mr-1 h-4 w-4" />
                        Saved scripts
                    </Link>
                    <div className="min-w-0 flex-1">
                        <h1 className="truncate text-sm font-semibold">
                            {script.title}
                        </h1>
                        <p className="text-xs text-muted-foreground">
                            {new Date(script.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>
            </header>
            <main className="mx-auto max-w-3xl p-6">
                <ScriptOutput
                    result={savedScriptToGenerated(script)}
                    genre={script.genre as Genre}
                    platform={script.platform as Platform}
                    tone={script.tone as Tone}
                    savedId={script.id}
                    showSave={false}
                />
            </main>
        </div>
    );
}
