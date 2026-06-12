"use client";

import { Copy, Clock, Film, ImageIcon, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import type { SceneBlock } from "@/types";
import { toast } from "sonner";

interface SceneProductionCardProps {
    scene: SceneBlock;
}

export function SceneProductionCard({ scene }: SceneProductionCardProps) {
    const videoPrompt = scene.videoPrompt || scene.prompt || "";

    async function copyText(text: string, label: string) {
        await navigator.clipboard.writeText(text);
        toast.success(`${label} copied!`);
    }

    function copyAllScene() {
        const parts = [
            `Scene ${scene.sceneNumber}`,
            scene.description ? `Visual: ${scene.description}` : "",
            videoPrompt ? `Video Prompt: ${videoPrompt}` : "",
            scene.imagePrompt ? `Image Prompt: ${scene.imagePrompt}` : "",
            scene.duration ? `Duration: ${scene.duration}` : "",
            scene.howToCreate ? `How to create: ${scene.howToCreate}` : "",
        ].filter(Boolean);
        copyText(parts.join("\n\n"), `Scene ${scene.sceneNumber}`);
    }

    return (
        <div className="rounded-lg border border-border bg-secondary/20 p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                    <Badge className="bg-indigo-600 text-white">
                        Scene {scene.sceneNumber}
                    </Badge>
                    {scene.duration && (
                        <Badge variant="outline" className="gap-1">
                            <Clock className="h-3 w-3" />
                            {scene.duration}
                        </Badge>
                    )}
                </div>
                <Button variant="ghost" size="sm" onClick={copyAllScene}>
                    <Copy className="mr-1 h-4 w-4" />
                    Copy all
                </Button>
            </div>

            {scene.description && (
                <div className="mb-3 rounded-md border border-indigo-500/20 bg-indigo-600/5 p-3">
                    <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-indigo-400">
                        <Film className="h-3 w-3" />
                        What to show
                    </p>
                    <p className="text-sm leading-relaxed">{scene.description}</p>
                </div>
            )}

            {videoPrompt && (
                <div className="mb-3 rounded-md border border-border bg-background/50 p-3">
                    <div className="mb-1 flex items-center justify-between">
                        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                            <Film className="h-3 w-3" />
                            Video prompt
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() => copyText(videoPrompt, "Video prompt")}
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">{videoPrompt}</p>
                    <p className="mt-2 text-xs text-indigo-400/80">
                        Paste into Pika or Runway → generate clip
                    </p>
                </div>
            )}

            {scene.imagePrompt && (
                <div className="mb-3 rounded-md border border-border bg-background/50 p-3">
                    <div className="mb-1 flex items-center justify-between">
                        <p className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-foreground">
                            <ImageIcon className="h-3 w-3" />
                            Image prompt
                        </p>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-7 px-2"
                            onClick={() =>
                                copyText(scene.imagePrompt, "Image prompt")
                            }
                        >
                            <Copy className="h-3.5 w-3.5" />
                        </Button>
                    </div>
                    <p className="text-sm text-muted-foreground">
                        {scene.imagePrompt}
                    </p>
                    <p className="mt-2 text-xs text-indigo-400/80">
                        Paste into Leonardo AI or Canva → backup still or B-roll
                    </p>
                </div>
            )}

            {scene.howToCreate && (
                <div className="rounded-md border border-emerald-500/20 bg-emerald-600/5 p-3">
                    <p className="mb-1 flex items-center gap-1 text-xs font-semibold uppercase tracking-wide text-emerald-400">
                        <Wrench className="h-3 w-3" />
                        How to create this scene
                    </p>
                    <p className="text-sm leading-relaxed">{scene.howToCreate}</p>
                </div>
            )}
        </div>
    );
}
