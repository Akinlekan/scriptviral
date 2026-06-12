import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { generateScriptText } from "@/lib/gemini";
import { parseScriptResponse } from "@/lib/parse-script";
import { incrementUsage } from "@/lib/usage";
import type { GenerateRequest } from "@/types";

export async function POST(request: Request) {
    try {
        const supabase = await createClient();
        const {
            data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
        }

        const body = (await request.json()) as GenerateRequest;

        if (!body.genre || !body.platform || !body.tone || !body.videoLength) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const raw = await generateScriptText(body);
        const parsed = parseScriptResponse(raw);
        await incrementUsage(user.id);
        const { getTotalUsageCount } = await import("@/lib/usage");
        const totalUsage = await getTotalUsageCount(user.id);

        return NextResponse.json({
            ...parsed,
            totalUsage,
        });
    } catch (error) {
        console.error("Generate error:", error);
        const message =
            error instanceof Error ? error.message : "Generation failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
