import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTotalUsageCount } from "@/lib/usage";

export async function GET() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const total = await getTotalUsageCount(user.id);
    return NextResponse.json({ total });
}
