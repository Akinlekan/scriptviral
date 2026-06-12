"use client";

import { useState } from "react";
import { SlidersHorizontal, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Pill } from "@/components/dashboard/pill";
import { ScriptOutput } from "@/components/dashboard/script-output";
import {
    GENRES,
    PLATFORMS,
    TONES,
    VIDEO_LENGTHS,
    INCLUDE_OPTIONS,
} from "@/lib/constants";
import type {
    GenerateRequest,
    GeneratedScript,
    Genre,
    Platform,
    Tone,
    VideoLength,
    IncludeOption,
} from "@/types";
import { incrementUsageCount } from "@/lib/local-storage";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";

interface ScriptGeneratorProps {
    onUsageUpdate?: (count: number) => void;
}

export function ScriptGenerator({ onUsageUpdate }: ScriptGeneratorProps) {
    const [genre, setGenre] = useState<Genre>("true_crime");
    const [platform, setPlatform] = useState<Platform>("youtube_longform");
    const [tone, setTone] = useState<Tone>("suspenseful");
    const [videoLength, setVideoLength] = useState<VideoLength>("medium");
    const [topic, setTopic] = useState("");
    const [include, setInclude] = useState<IncludeOption[]>([
        "hook",
        "full_script",
        "scene_prompts",
        "titles",
        "caption",
    ]);
    const [loading, setLoading] = useState(false);
    const [result, setResult] = useState<GeneratedScript | null>(null);
    const [meta, setMeta] = useState<{
        genre: Genre;
        platform: Platform;
        tone: Tone;
    } | null>(null);

    function toggleInclude(option: IncludeOption) {
        setInclude((prev) =>
            prev.includes(option)
                ? prev.filter((o) => o !== option)
                : [...prev, option]
        );
    }

    async function handleGenerate() {
        if (include.length === 0) {
            toast.error("Select at least one output to include");
            return;
        }

        setLoading(true);
        setResult(null);

        const payload: GenerateRequest = {
            genre,
            platform,
            tone,
            videoLength,
            topic: topic || undefined,
            include,
        };

        try {
            const res = await fetch("/api/generate", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Generation failed");

            setResult(data);
            setMeta({ genre, platform, tone });
            if (onUsageUpdate) {
                onUsageUpdate(incrementUsageCount());
            }
            toast.success("Script generated!");
        } catch (error) {
            toast.error(
                error instanceof Error ? error.message : "Something went wrong"
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-6">
            <Card className="border-border/50 bg-card/80">
                <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <SlidersHorizontal className="h-5 w-5 text-indigo-400" />
                        Story settings
                    </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                    <div className="space-y-3">
                        <Label>Story genre</Label>
                        <div className="flex flex-wrap gap-2">
                            {GENRES.map((g) => (
                                <Pill
                                    key={g.value}
                                    label={g.label}
                                    selected={genre === g.value}
                                    onClick={() => setGenre(g.value)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Platform</Label>
                        <div className="flex flex-wrap gap-2">
                            {PLATFORMS.map((p) => (
                                <Pill
                                    key={p.value}
                                    label={p.label}
                                    selected={platform === p.value}
                                    onClick={() => setPlatform(p.value)}
                                />
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="topic">
                            Story topic or keyword{" "}
                            <span className="text-muted-foreground">
                                (optional — leave blank to auto-generate)
                            </span>
                        </Label>
                        <Input
                            id="topic"
                            placeholder="e.g. man disappears after winning lottery, or leave blank"
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="bg-secondary/30"
                        />
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                        <div className="space-y-2">
                            <Label>Tone</Label>
                            <Select
                                value={tone}
                                onValueChange={(v) => setTone(v as Tone)}
                            >
                                <SelectTrigger className="bg-secondary/30">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {TONES.map((t) => (
                                        <SelectItem
                                            key={t.value}
                                            value={t.value}
                                        >
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Video length</Label>
                            <Select
                                value={videoLength}
                                onValueChange={(v) =>
                                    setVideoLength(v as VideoLength)
                                }
                            >
                                <SelectTrigger className="bg-secondary/30">
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    {VIDEO_LENGTHS.map((l) => (
                                        <SelectItem
                                            key={l.value}
                                            value={l.value}
                                        >
                                            {l.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <Label>Include</Label>
                        <div className="flex flex-wrap gap-2">
                            {INCLUDE_OPTIONS.map((opt) => (
                                <Pill
                                    key={opt.value}
                                    label={opt.label}
                                    selected={include.includes(opt.value)}
                                    onClick={() => toggleInclude(opt.value)}
                                />
                            ))}
                        </div>
                    </div>

                    <Button
                        onClick={handleGenerate}
                        disabled={loading}
                        className="w-full bg-indigo-600 py-6 text-base hover:bg-indigo-700"
                        size="lg"
                    >
                        <Sparkles className="mr-2 h-5 w-5" />
                        {loading ? "Generating..." : "Generate script"}
                    </Button>
                </CardContent>
            </Card>

            {loading && (
                <Card className="border-border/50">
                    <CardContent className="space-y-4 pt-6">
                        <Skeleton className="h-6 w-1/3" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-2/3" />
                        <Skeleton className="h-32 w-full" />
                    </CardContent>
                </Card>
            )}

            {result && meta && !loading && (
                <ScriptOutput
                    result={result}
                    genre={meta.genre}
                    platform={meta.platform}
                    tone={meta.tone}
                />
            )}
        </div>
    );
}
