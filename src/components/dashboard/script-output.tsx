"use client";

import { useState } from "react";
import { Copy, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { GENRE_LABELS, PLATFORM_LABELS } from "@/lib/constants";
import { saveScript } from "@/lib/local-storage";
import type { GeneratedScript, Genre, Platform, Tone } from "@/types";
import { toast } from "sonner";

interface ScriptOutputProps {
    result: GeneratedScript;
    genre: Genre;
    platform: Platform;
    tone: Tone;
}

export function ScriptOutput({
    result,
    genre,
    platform,
    tone,
}: ScriptOutputProps) {
    const [saving, setSaving] = useState(false);

    async function copyText(text: string, label: string) {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    }

    function handleSave() {
        setSaving(true);
        try {
            const title =
                result.titles[0] ||
                result.hook.slice(0, 60) ||
                "Untitled Script";

            saveScript({
                title,
                genre,
                platform,
                tone,
                hook: result.hook,
                script: result.script,
                scenes: result.scenes,
                titles: result.titles.join("\n"),
                caption: result.caption,
            });

            toast.success("Script saved to library!");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Save failed"
            );
        } finally {
            setSaving(false);
        }
    }

    return (
        <Card className="border-border/50 bg-card/80">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
                <div>
                    <CardTitle className="text-lg">Generated output</CardTitle>
                    <div className="mt-2 flex flex-wrap gap-2">
                        <Badge variant="secondary">{GENRE_LABELS[genre]}</Badge>
                        <Badge variant="secondary">
                            {PLATFORM_LABELS[platform]}
                        </Badge>
                    </div>
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleSave}
                    disabled={saving}
                >
                    <Save className="mr-2 h-4 w-4" />
                    {saving ? "Saving..." : "Save script"}
                </Button>
            </CardHeader>
            <CardContent>
                <Tabs defaultValue="script">
                    <TabsList className="mb-4">
                        <TabsTrigger value="script">Script</TabsTrigger>
                        <TabsTrigger value="prompts">Video prompts</TabsTrigger>
                        <TabsTrigger value="titles">Titles & caption</TabsTrigger>
                    </TabsList>

                    <TabsContent value="script" className="space-y-4">
                        {result.hook && (
                            <div className="rounded-lg border border-indigo-500/30 bg-indigo-600/10 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold text-indigo-400">
                                        Hook
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyText(result.hook, "Hook")
                                        }
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {result.hook}
                                </p>
                            </div>
                        )}
                        {result.script && (
                            <div className="rounded-lg border border-border bg-secondary/20 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold">
                                        Full narration
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyText(result.script, "Script")
                                        }
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="whitespace-pre-wrap text-sm leading-relaxed">
                                    {result.script}
                                </p>
                            </div>
                        )}
                    </TabsContent>

                    <TabsContent value="prompts" className="space-y-4">
                        {result.scenes.length === 0 ? (
                            <p className="text-sm text-muted-foreground">
                                No scene prompts generated.
                            </p>
                        ) : (
                            result.scenes.map((scene) => (
                                <div
                                    key={scene.sceneNumber}
                                    className="rounded-lg border border-border bg-secondary/20 p-4"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <h3 className="text-sm font-semibold text-indigo-400">
                                            Scene {scene.sceneNumber}
                                        </h3>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() =>
                                                copyText(
                                                    `Visual: ${scene.description}\n\nPrompt: ${scene.prompt}`,
                                                    `Scene ${scene.sceneNumber}`
                                                )
                                            }
                                        >
                                            <Copy className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <p className="mb-2 text-sm">
                                        <span className="font-medium">
                                            Visual:{" "}
                                        </span>
                                        {scene.description}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                        <span className="font-medium text-foreground">
                                            AI Prompt:{" "}
                                        </span>
                                        {scene.prompt}
                                    </p>
                                </div>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="titles" className="space-y-4">
                        {result.titles.length > 0 && (
                            <div className="rounded-lg border border-border bg-secondary/20 p-4">
                                <div className="mb-3 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold">
                                        Viral title ideas
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyText(
                                                result.titles.join("\n"),
                                                "Titles"
                                            )
                                        }
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <ol className="list-inside list-decimal space-y-2 text-sm">
                                    {result.titles.map((title, i) => (
                                        <li key={i}>{title}</li>
                                    ))}
                                </ol>
                            </div>
                        )}
                        {result.caption && (
                            <div className="rounded-lg border border-border bg-secondary/20 p-4">
                                <div className="mb-2 flex items-center justify-between">
                                    <h3 className="text-sm font-semibold">
                                        Social caption
                                    </h3>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() =>
                                            copyText(result.caption, "Caption")
                                        }
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                                <p className="whitespace-pre-wrap text-sm">
                                    {result.caption}
                                </p>
                            </div>
                        )}
                    </TabsContent>
                </Tabs>
            </CardContent>
        </Card>
    );
}
