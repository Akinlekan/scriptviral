"use client";

import { useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { ScriptGenerator } from "@/components/dashboard/script-generator";

interface DashboardShellProps {
    email: string;
    initialUsageCount: number;
    children?: React.ReactNode;
}

export function DashboardShell({
    email,
    initialUsageCount,
    children,
}: DashboardShellProps) {
    const [usageCount, setUsageCount] = useState(initialUsageCount);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <TopBar email={email} usageCount={usageCount} />
                <main className="flex-1 overflow-auto p-6">
                    {children ?? (
                        <div className="mx-auto max-w-3xl">
                            <ScriptGenerator
                                onUsageUpdate={setUsageCount}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
