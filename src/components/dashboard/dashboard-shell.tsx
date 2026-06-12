"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/dashboard/sidebar";
import { TopBar } from "@/components/dashboard/topbar";
import { ScriptGenerator } from "@/components/dashboard/script-generator";
import { getUsageCount } from "@/lib/local-storage";

interface DashboardShellProps {
    children?: React.ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
    const [usageCount, setUsageCount] = useState(0);

    useEffect(() => {
        setUsageCount(getUsageCount());
    }, []);

    return (
        <div className="flex min-h-screen bg-background">
            <Sidebar />
            <div className="flex flex-1 flex-col">
                <TopBar usageCount={usageCount} />
                <main className="flex-1 overflow-auto p-6">
                    {children ?? (
                        <div className="mx-auto max-w-3xl">
                            <ScriptGenerator onUsageUpdate={setUsageCount} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
