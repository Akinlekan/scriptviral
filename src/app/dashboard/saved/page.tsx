import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { getTotalUsageCount } from "@/lib/usage";
import { SavedScriptsClient } from "@/components/dashboard/saved-scripts-client";

export default async function SavedScriptsPage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) redirect("/login");

    const usageCount = await getTotalUsageCount(user.id);

    return (
        <SavedScriptsClient
            email={user.email ?? "User"}
            usageCount={usageCount}
        />
    );
}
