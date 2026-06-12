import { createServiceClient } from "@/lib/supabase/server";

export function getCurrentMonthYear(): string {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    return `${year}-${month}`;
}

export async function incrementUsage(userId: string): Promise<number> {
    const supabase = await createServiceClient();
    const monthYear = getCurrentMonthYear();

    const { data: existing } = await supabase
        .from("usage")
        .select("id, count")
        .eq("user_id", userId)
        .eq("month_year", monthYear)
        .maybeSingle();

    if (existing) {
        const newCount = existing.count + 1;
        await supabase
            .from("usage")
            .update({ count: newCount })
            .eq("id", existing.id);
        return newCount;
    }

    await supabase.from("usage").insert({
        user_id: userId,
        month_year: monthYear,
        count: 1,
    });
    return 1;
}

export async function getUsageCount(userId: string): Promise<number> {
    const supabase = await createServiceClient();
    const monthYear = getCurrentMonthYear();

    const { data } = await supabase
        .from("usage")
        .select("count")
        .eq("user_id", userId)
        .eq("month_year", monthYear)
        .maybeSingle();

    return data?.count ?? 0;
}

export async function getTotalUsageCount(userId: string): Promise<number> {
    const supabase = await createServiceClient();

    const { data } = await supabase
        .from("usage")
        .select("count")
        .eq("user_id", userId);

    if (!data?.length) return 0;
    return data.reduce((sum, row) => sum + row.count, 0);
}
