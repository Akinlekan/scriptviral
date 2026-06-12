"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface SettingsClientProps {
    email: string;
    usageCount: number;
}

export function SettingsClient({ email, usageCount }: SettingsClientProps) {
    const router = useRouter();
    const supabase = createClient();

    async function handleSignOut() {
        await supabase.auth.signOut();
        router.push("/login");
        router.refresh();
    }

    return (
        <DashboardShell email={email} initialUsageCount={usageCount}>
            <div className="mx-auto max-w-2xl space-y-6">
                <h1 className="text-2xl font-bold">Settings</h1>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Account</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Email
                            </p>
                            <p className="font-medium">{email}</p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Plan
                            </p>
                            <p className="font-medium text-indigo-400">
                                Free forever — unlimited generations
                            </p>
                        </div>
                        <Separator />
                        <div>
                            <p className="text-sm text-muted-foreground">
                                Total scripts generated
                            </p>
                            <p className="font-medium">{usageCount}</p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-base">Session</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <Button
                            variant="destructive"
                            onClick={handleSignOut}
                        >
                            Sign out
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </DashboardShell>
    );
}
