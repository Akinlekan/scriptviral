"use client";

import { useEffect, useState } from "react";
import { Clapperboard, Film, Sparkles, Type, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const STEPS = [
    { icon: Sparkles, label: "Crafting your scroll-stopping hook…" },
    { icon: Type, label: "Writing full narration script…" },
    { icon: Film, label: "Building scene-by-scene visuals…" },
    { icon: Wand2, label: "Generating AI video & image prompts…" },
    { icon: Clapperboard, label: "Preparing your production guide…" },
];

export function GenerationLoader() {
    const [stepIndex, setStepIndex] = useState(0);
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const stepTimer = setInterval(() => {
            setStepIndex((i) => (i + 1) % STEPS.length);
        }, 2800);
        return () => clearInterval(stepTimer);
    }, []);

    useEffect(() => {
        const start = Date.now();
        const duration = 45000;
        const tick = setInterval(() => {
            const elapsed = Date.now() - start;
            const next = Math.min(92, (elapsed / duration) * 92);
            setProgress(next);
        }, 200);
        return () => clearInterval(tick);
    }, []);

    const StepIcon = STEPS[stepIndex].icon;

    return (
        <div className="overflow-hidden rounded-xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-card to-card p-8">
            <div className="mx-auto max-w-md text-center">
                <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center">
                    <span className="absolute inset-0 animate-ping rounded-full bg-indigo-500/20" />
                    <span className="absolute inset-2 animate-pulse rounded-full bg-indigo-500/10" />
                    <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-indigo-600 shadow-lg shadow-indigo-500/30">
                        <Sparkles className="h-8 w-8 animate-pulse text-white" />
                    </div>
                </div>

                <h3 className="text-lg font-semibold">Generating your viral script</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    This usually takes 15–45 seconds
                </p>

                <div className="mt-6 h-2 overflow-hidden rounded-full bg-secondary">
                    <div
                        className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-purple-500 transition-all duration-300 ease-out"
                        style={{ width: `${progress}%` }}
                    />
                </div>

                <div
                    key={stepIndex}
                    className="mt-6 flex items-center justify-center gap-2 text-sm text-indigo-300 transition-opacity duration-500"
                >
                    <StepIcon className="h-4 w-4 shrink-0" />
                    <span>{STEPS[stepIndex].label}</span>
                </div>

                <div className="mt-8 flex justify-center gap-1.5">
                    {STEPS.map((_, i) => (
                        <span
                            key={i}
                            className={cn(
                                "h-1.5 rounded-full transition-all duration-500",
                                i === stepIndex
                                    ? "w-6 bg-indigo-500"
                                    : "w-1.5 bg-indigo-500/25"
                            )}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}
