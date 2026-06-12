"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Trash2, Pencil, ExternalLink } from "lucide-react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { GENRE_LABELS } from "@/lib/constants";
import {
    deleteScript,
    getSavedScripts,
    renameScript,
    type LocalSavedScript,
} from "@/lib/local-storage";
import type { Genre } from "@/types";
import { toast } from "sonner";

export function SavedScriptsClient() {
    const [scripts, setScripts] = useState<LocalSavedScript[]>([]);
    const [editing, setEditing] = useState<LocalSavedScript | null>(null);
    const [newTitle, setNewTitle] = useState("");

    function loadScripts() {
        setScripts(getSavedScripts());
    }

    useEffect(() => {
        loadScripts();
    }, []);

    function openScript(id: string) {
        window.open(
            `/dashboard/saved/${id}`,
            "_blank",
            "noopener,noreferrer"
        );
    }

    function handleRename() {
        if (!editing) return;
        renameScript(editing.id, newTitle);
        toast.success("Script renamed");
        setEditing(null);
        loadScripts();
    }

    function handleDelete(id: string) {
        deleteScript(id);
        toast.success("Script deleted");
        loadScripts();
    }

    return (
        <DashboardShell>
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Saved Scripts</h1>
                        <p className="mt-1 text-sm text-muted-foreground">
                            Full scripts, production guides, and prompts —
                            stored in your browser
                        </p>
                    </div>
                    <Link
                        href="/dashboard"
                        className={cn(
                            buttonVariants(),
                            "bg-indigo-600 hover:bg-indigo-700"
                        )}
                    >
                        New script
                    </Link>
                </div>

                {scripts.length === 0 ? (
                    <Card className="border-dashed">
                        <CardContent className="flex flex-col items-center py-12 text-center">
                            <p className="text-muted-foreground">
                                No saved scripts yet.
                            </p>
                            <Link
                                href="/dashboard"
                                className={cn(buttonVariants(), "mt-4")}
                            >
                                Generate your first script
                            </Link>
                        </CardContent>
                    </Card>
                ) : (
                    <div className="space-y-4">
                        {scripts.map((script) => (
                            <Card
                                key={script.id}
                                className="cursor-pointer transition-colors hover:border-indigo-500/40"
                                onClick={() => openScript(script.id)}
                            >
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div className="min-w-0 flex-1 pr-4">
                                        <CardTitle className="text-base">
                                            {script.title}
                                        </CardTitle>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {GENRE_LABELS[
                                                script.genre as Genre
                                            ] ?? script.genre}{" "}
                                            ·{" "}
                                            {script.scenes.length} scenes ·{" "}
                                            {new Date(
                                                script.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div
                                        className="flex shrink-0 gap-1"
                                        onClick={(e) => e.stopPropagation()}
                                    >
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            title="Open in new tab"
                                            onClick={() =>
                                                openScript(script.id)
                                            }
                                        >
                                            <ExternalLink className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => {
                                                setEditing(script);
                                                setNewTitle(script.title);
                                            }}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                handleDelete(script.id)
                                            }
                                        >
                                            <Trash2 className="h-4 w-4 text-destructive" />
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="line-clamp-2 text-sm text-muted-foreground">
                                        {script.hook ||
                                            script.script.slice(0, 150)}
                                    </p>
                                    {script.productionGuide && (
                                        <p className="mt-2 text-xs text-indigo-400/80">
                                            Includes production guide & scene
                                            prompts
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <Dialog open={!!editing} onOpenChange={() => setEditing(null)}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Rename script</DialogTitle>
                    </DialogHeader>
                    <Input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        placeholder="Script title"
                    />
                    <Button onClick={handleRename} className="mt-2">
                        Save
                    </Button>
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
