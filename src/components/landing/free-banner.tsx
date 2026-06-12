import { Sparkles } from "lucide-react";

export function FreeBanner() {
    return (
        <section className="border-y border-indigo-500/20 bg-indigo-600/10 px-6 py-16">
            <div className="mx-auto max-w-3xl text-center">
                <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-indigo-600 px-4 py-1.5 text-sm font-medium text-white">
                    <Sparkles className="h-4 w-4" />
                    Free forever
                </div>
                <h2 className="text-3xl font-bold sm:text-4xl">
                    Every feature. No limits. No credit card.
                </h2>
                <p className="mt-4 text-lg text-muted-foreground">
                    ScriptViral is completely free — unlimited script
                    generations, all genres, saved scripts library, and every
                    output type included.
                </p>
            </div>
        </section>
    );
}
