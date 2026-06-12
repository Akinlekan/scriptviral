import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Hero() {
    return (
        <section className="relative overflow-hidden px-6 py-24 lg:py-32">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-background to-background" />
            <div className="mx-auto max-w-4xl text-center">
                <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-600/10 px-4 py-1.5 text-sm text-indigo-400">
                    <Sparkles className="h-4 w-4" />
                    AI-powered script generation
                </div>
                <h1 className="text-4xl font-bold tracking-tight sm:text-6xl lg:text-7xl">
                    Generate viral video{" "}
                    <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                        scripts in seconds
                    </span>
                </h1>
                <p className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground">
                    Create scroll-stopping hooks, full narration scripts, and
                    cinematic AI video prompts for YouTube, TikTok, and Reels —
                    all in one click.
                </p>
                <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
                    <Link
                        href="/signup"
                        className={cn(
                            buttonVariants({ size: "lg" }),
                            "bg-indigo-600 px-8 hover:bg-indigo-700"
                        )}
                    >
                        Start free
                        <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                    <Link
                        href="/login"
                        className={buttonVariants({ variant: "outline", size: "lg" })}
                    >
                        Sign in
                    </Link>
                </div>
            </div>
        </section>
    );
}
