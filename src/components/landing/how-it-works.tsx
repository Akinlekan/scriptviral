import { Settings, Wand2, Film } from "lucide-react";

const steps = [
    {
        icon: Settings,
        title: "Choose your genre",
        description:
            "Pick from true crime, motivational, conspiracy, and more. Set platform, tone, and length.",
    },
    {
        icon: Wand2,
        title: "Generate script",
        description:
            "AI creates hooks, narration, scene prompts, titles, and captions tailored to your settings.",
    },
    {
        icon: Film,
        title: "Film & post",
        description:
            "Copy cinematic AI video prompts, record your narration, and publish viral content.",
    },
];

export function HowItWorks() {
    return (
        <section className="px-6 py-24">
            <div className="mx-auto max-w-5xl">
                <h2 className="text-center text-3xl font-bold">How it works</h2>
                <p className="mx-auto mt-4 max-w-xl text-center text-muted-foreground">
                    Three simple steps from idea to publish-ready content
                </p>
                <div className="mt-16 grid gap-8 md:grid-cols-3">
                    {steps.map((step, i) => {
                        const Icon = step.icon;
                        return (
                            <div
                                key={step.title}
                                className="relative rounded-xl border border-border bg-card/50 p-6 text-center"
                            >
                                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600/15 text-indigo-400">
                                    <Icon className="h-6 w-6" />
                                </div>
                                <span className="text-xs font-medium text-indigo-400">
                                    Step {i + 1}
                                </span>
                                <h3 className="mt-2 text-lg font-semibold">
                                    {step.title}
                                </h3>
                                <p className="mt-2 text-sm text-muted-foreground">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
