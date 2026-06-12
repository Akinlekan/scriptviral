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
import { Skeleton } from "@/components/ui/skeleton";
import { GENRE_LABELS } from "@/lib/constants";
import type { SavedScript, Genre } from "@/types";
import { toast } from "sonner";

interface SavedScriptsClientProps {
    email: string;
    usageCount: number;
}

export function SavedScriptsClient({
    email,
    usageCount,
}: SavedScriptsClientProps) {
    const [scripts, setScripts] = useState<SavedScript[]>([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState<SavedScript | null>(null);
    const [newTitle, setNewTitle] = useState("");
    const [viewing, setViewing] = useState<SavedScript | null>(null);

    async function loadScripts() {
        const res = await fetch("/api/scripts");
        const data = await res.json();
        setScripts(data);
        setLoading(false);
    }

    useEffect(() => {
        loadScripts();
    }, []);

    async function handleRename() {
        if (!editing) return;
        const res = await fetch(`/api/scripts/${editing.id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title: newTitle }),
        });
        if (res.ok) {
            toast.success("Script renamed");
            setEditing(null);
            loadScripts();
        } else {
            toast.error("Failed to rename");
        }
    }

    async function handleDelete(id: string) {
        const res = await fetch(`/api/scripts/${id}`, { method: "DELETE" });
        if (res.ok) {
            toast.success("Script deleted");
            loadScripts();
        } else {
            toast.error("Failed to delete");
        }
    }

    return (
        <DashboardShell email={email} initialUsageCount={usageCount}>
            <div className="mx-auto max-w-4xl">
                <div className="mb-6 flex items-center justify-between">
                    <h1 className="text-2xl font-bold">Saved Scripts</h1>
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

                {loading ? (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <Skeleton key={i} className="h-24 w-full" />
                        ))}
                    </div>
                ) : scripts.length === 0 ? (
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
                            <Card key={script.id}>
                                <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
                                    <div>
                                        <CardTitle className="text-base">
                                            {script.title}
                                        </CardTitle>
                                        <p className="mt-1 text-xs text-muted-foreground">
                                            {GENRE_LABELS[
                                                script.genre as Genre
                                            ] ?? script.genre}{" "}
                                            ·{" "}
                                            {new Date(
                                                script.created_at
                                            ).toLocaleDateString()}
                                        </p>
                                    </div>
                                    <div className="flex gap-1">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setViewing(script)}
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
                                        {script.hook || script.script.slice(0, 150)}
                                    </p>
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

            <Dialog open={!!viewing} onOpenChange={() => setViewing(null)}>
                <DialogContent className="max-h-[80vh] max-w-2xl overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{viewing?.title}</DialogTitle>
                    </DialogHeader>
                    {viewing && (
                        <div className="space-y-4 text-sm">
                            {viewing.hook && (
                                <div>
                                    <h4 className="font-semibold text-indigo-400">
                                        Hook
                                    </h4>
                                    <p className="mt-1 whitespace-pre-wrap">
                                        {viewing.hook}
                                    </p>
                                </div>
                            )}
                            {viewing.script && (
                                <div>
                                    <h4 className="font-semibold">Script</h4>
                                    <p className="mt-1 whitespace-pre-wrap">
                                        {viewing.script}
                                    </p>
                                </div>
                            )}
                            {viewing.caption && (
                                <div>
                                    <h4 className="font-semibold">Caption</h4>
                                    <p className="mt-1 whitespace-pre-wrap">
                                        {viewing.caption}
                                    </p>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </DashboardShell>
    );
}
