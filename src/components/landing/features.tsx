import {
    Clapperboard,
    Bookmark,
    Zap,
    Layers,
    Hash,
} from "lucide-react";

const features = [
    {
        icon: Clapperboard,
        title: "10 viral niches",
        description:
            "True crime, fitness, finance, faith, parenting, motivational, conspiracy, and more.",
    },
    {
        icon: Layers,
        title: "Multi-platform output",
        description:
            "Optimized for YouTube longform, TikTok/Reels, or both with a single generation.",
    },
    {
        icon: Zap,
        title: "Scroll-stopping hooks",
        description:
            "AI-crafted opening lines designed to stop the scroll and keep viewers watching.",
    },
    {
        icon: Clapperboard,
        title: "Scene-by-scene prompts",
        description:
            "Cinematic AI video prompts with camera angles, lighting, and mood for each scene.",
    },
    {
        icon: Hash,
        title: "Titles & captions",
        description:
            "Five viral title options plus a ready-to-post social caption with hashtags.",
    },
    {
        icon: Bookmark,
        title: "Saved scripts library",
        description:
            "Save, rename, and manage scripts in your browser — no account needed.",
    },
];

export function Features() {
    return (
        <section className="border-t border-border bg-card/30 px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-center text-3xl font-bold">
                    Everything you need to go viral
                </h2>
                <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
                    From hook to hashtag — one tool for the entire content pipeline
                </p>
                <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {features.map((feature) => {
                        const Icon = feature.icon;
                        return (
                            <div
                                key={feature.title}
                                className="rounded-xl border border-border bg-background p-6"
                            >
                                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600/15 text-indigo-400">
                                    <Icon className="h-5 w-5" />
                                </div>
                                <h3 className="font-semibold">{feature.title}</h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {feature.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
