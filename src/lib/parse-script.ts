import type { GeneratedScript, SceneBlock } from "@/types";

export function parseScriptResponse(raw: string): GeneratedScript {
    const hook = extractSection(raw, "HOOK");
    const script = extractSection(raw, "SCRIPT");
    const scenes = extractScenes(raw);
    const titlesRaw = extractSection(raw, "TITLES");
    const caption = extractSection(raw, "CAPTION");
    const titles = parseTitles(titlesRaw);

    return { hook, script, scenes, titles, caption };
}

function extractSection(text: string, label: string): string {
    const regex = new RegExp(
        `${label}:\\s*([\\s\\S]*?)(?=\\n(?:HOOK|SCRIPT|SCENE \\d+|TITLES|CAPTION):|$)`,
        "i"
    );
    const match = text.match(regex);
    return match?.[1]?.trim() ?? "";
}

function extractScenes(text: string): SceneBlock[] {
    const sceneRegex =
        /SCENE\s+(\d+):\s*([\s\S]*?)\|\s*PROMPT:\s*([\s\S]*?)(?=\nSCENE\s+\d+:|\nTITLES:|\nCAPTION:|$)/gi;
    const scenes: SceneBlock[] = [];
    let match: RegExpExecArray | null;

    while ((match = sceneRegex.exec(text)) !== null) {
        scenes.push({
            sceneNumber: parseInt(match[1], 10),
            description: match[2].trim(),
            prompt: match[3].trim(),
        });
    }

    return scenes.sort((a, b) => a.sceneNumber - b.sceneNumber);
}

function parseTitles(raw: string): string[] {
    if (!raw) return [];
    return raw
        .split("\n")
        .map((line) => line.replace(/^\d+[\.\)]\s*/, "").trim())
        .filter(Boolean)
        .slice(0, 5);
}
