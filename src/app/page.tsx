import Link from "next/link";
import { Sparkles } from "lucide-react";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { Features } from "@/components/landing/features";
import { FreeBanner } from "@/components/landing/free-banner";
import { Footer } from "@/components/landing/footer";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function HomePage() {
    return (
        <div className="min-h-screen">
            <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur">
                <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
                    <Link href="/" className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                            <Sparkles className="h-4 w-4 text-white" />
                        </div>
                        <span className="text-lg font-bold">ScriptViral</span>
                    </Link>
                    <div className="flex items-center gap-3">
                        <Link
                            href="/dashboard"
                            className={cn(
                                buttonVariants(),
                                "bg-indigo-600 hover:bg-indigo-700"
                            )}
                        >
                            Start generating
                        </Link>
                    </div>
                </div>
            </header>
            <Hero />
            <HowItWorks />
            <Features />
            <FreeBanner />
            <Footer />
        </div>
    );
}
