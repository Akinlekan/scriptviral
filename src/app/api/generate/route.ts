import { NextResponse } from "next/server";
import { generateScriptText } from "@/lib/gemini";
import { parseScriptResponse } from "@/lib/parse-script";
import type { GenerateRequest } from "@/types";

export async function POST(request: Request) {
    try {
        const body = (await request.json()) as GenerateRequest;

        if (!body.genre || !body.platform || !body.tone || !body.videoLength) {
            return NextResponse.json(
                { error: "Missing required fields" },
                { status: 400 }
            );
        }

        const raw = await generateScriptText(body);
        const parsed = parseScriptResponse(raw);

        return NextResponse.json(parsed);
    } catch (error) {
        console.error("Generate error:", error);
        const message =
            error instanceof Error ? error.message : "Generation failed";
        return NextResponse.json({ error: message }, { status: 500 });
    }
}
