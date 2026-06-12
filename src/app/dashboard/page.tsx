import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTotalUsageCount } from "@/lib/usage";
import { DashboardShell } from "@/components/dashboard/dashboard-shell";

export default async function DashboardPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const usageCount = await getTotalUsageCount(user.id);

    return (
        <DashboardShell
            email={user.email ?? "User"}
            initialUsageCount={usageCount}
        />
    );
}
