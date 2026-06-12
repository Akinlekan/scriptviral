"use client";

import { useEffect, useState } from "react";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getUsageCount, getSavedScripts } from "@/lib/local-storage";

export function SettingsClient() {
    const [usageCount, setUsageCount] = useState(0);
    const [savedCount, setSavedCount] = useState(0);

    useEffect(() => {
        setUsageCount(getUsageCount());
        setSavedCount(getSavedScripts().length);
    }, []);

    return (
        <DashboardShell>
            <div className="mx-auto max-w-2xl space-y-6">
                <h1 className="text-2xl font-bold">About</h1>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">ScriptViral</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 text-sm text-muted-foreground">
                        <p>
                            Free to use — no signup, no account, no limits.
                            Generate viral video scripts instantly.
                        </p>
                        <p>
                            Your saved scripts and usage count are stored
                            locally in this browser. Clearing browser data will
                            remove them.
                        </p>
                        <div className="grid gap-3 rounded-lg border border-border bg-secondary/20 p-4 text-foreground">
                            <div className="flex justify-between">
                                <span>Scripts generated</span>
                                <span className="font-medium">{usageCount}</span>
                            </div>
                            <div className="flex justify-between">
                                <span>Saved scripts</span>
                                <span className="font-medium">{savedCount}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
