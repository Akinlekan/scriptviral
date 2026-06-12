import Link from "next/link";
import { Sparkles } from "lucide-react";

export function Footer() {
    return (
        <footer className="border-t border-border px-6 py-12">
            <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-6 sm:flex-row">
                <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                        <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <span className="font-bold">ScriptViral</span>
                </div>
                <div className="flex gap-6 text-sm text-muted-foreground">
                    <Link href="/signup" className="hover:text-foreground">
                        Sign up
                    </Link>
                    <Link href="/login" className="hover:text-foreground">
                        Login
                    </Link>
                </div>
                <p className="text-sm text-muted-foreground">
                    © {new Date().getFullYear()} ScriptViral. All rights reserved.
                </p>
            </div>
        </footer>
    );
}
