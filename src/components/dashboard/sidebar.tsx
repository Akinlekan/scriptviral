"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    PenLine,
    Bookmark,
    Settings,
    Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
    { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { href: "/dashboard", label: "New Script", icon: PenLine, exact: true },
    { href: "/dashboard/saved", label: "Saved Scripts", icon: Bookmark },
    { href: "/dashboard/settings", label: "About", icon: Settings },
];

export function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 flex-shrink-0 border-r border-border bg-card/50 md:flex md:flex-col">
            <div className="flex items-center gap-2 border-b border-border px-6 py-5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-600">
                    <Sparkles className="h-4 w-4 text-white" />
                </div>
                <span className="text-lg font-bold">ScriptViral</span>
            </div>
            <nav className="flex-1 space-y-1 p-4">
                {navItems.map((item) => {
                    const isActive =
                        item.href === "/dashboard"
                            ? pathname === "/dashboard"
                            : pathname.startsWith(item.href) &&
                              item.href !== "/dashboard";
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.label}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                                isActive
                                    ? "bg-indigo-600/15 text-indigo-400"
                                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                            )}
                        >
                            <Icon className="h-4 w-4" />
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
            <div className="border-t border-border p-4">
                <div className="rounded-lg bg-indigo-600/10 p-3 text-center">
                    <p className="text-xs font-medium text-indigo-400">
                        Free forever
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                        No signup · Unlimited use
                    </p>
                </div>
            </div>
        </aside>
    );
}
