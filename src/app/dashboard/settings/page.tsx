import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTotalUsageCount } from "@/lib/usage";
import { SettingsClient } from "@/components/dashboard/settings-client";

export default async function SettingsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const usageCount = await getTotalUsageCount(user.id);

    return (
        <SettingsClient
            email={user.email ?? "User"}
            usageCount={usageCount}
        />
    );
}
