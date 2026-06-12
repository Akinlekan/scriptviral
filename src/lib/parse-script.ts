import type { GeneratedScript, SceneBlock } from "@/types";

export function parseScriptResponse(raw: string): GeneratedScript {
    const hook = extractSection(raw, "HOOK");
    const script = extractSection(raw, "SCRIPT");
    const scenes = extractScenes(raw);
    const titlesRaw = extractSection(raw, "TITLES");
    const caption = extractSection(raw, "CAPTION");
    const productionGuide = extractSection(raw, "PRODUCTION GUIDE");
    const titles = parseTitles(titlesRaw);

    return { hook, script, scenes, titles, caption, productionGuide };
}

function extractSection(text: string, label: string): string {
    const regex = new RegExp(
        `${label}:\\s*([\\s\\S]*?)(?=\\n(?:HOOK|SCRIPT|SCENE \\d+|TITLES|CAPTION|PRODUCTION GUIDE):|$)`,
        "i"
    );
    const match = text.match(regex);
    return match?.[1]?.trim() ?? "";
}

function extractScenes(text: string): SceneBlock[] {
    const parts = text.split(/(?=SCENE\s+\d+:)/gi).filter((p) =>
        /^SCENE\s+\d+/i.test(p.trim())
    );

    if (parts.length > 0) {
        const parsed = parts
            .map(parseSceneBlock)
            .filter((s): s is SceneBlock => s !== null);
        if (parsed.length > 0) return parsed.sort((a, b) => a.sceneNumber - b.sceneNumber);
    }

    return extractLegacyScenes(text);
}

function parseSceneBlock(block: string): SceneBlock | null {
    const numMatch = block.match(/^SCENE\s+(\d+):/i);
    if (!numMatch) return null;

    const sceneNumber = parseInt(numMatch[1], 10);
    const body = block.replace(/^SCENE\s+\d+:\s*/i, "");

    const videoPrompt =
        extractField(body, "VIDEO PROMPT") ||
        extractField(body, "PROMPT") ||
        "";
    const description =
        extractField(body, "VISUAL") ||
        extractInlineDescription(body, videoPrompt);
    const imagePrompt = extractField(body, "IMAGE PROMPT") || "";
    const duration = extractField(body, "DURATION") || "3–5 sec";
    const howToCreate =
        extractField(body, "HOW TO CREATE") ||
        extractField(body, "CREATE") ||
        defaultHowToCreate(videoPrompt, imagePrompt);

    if (!description && !videoPrompt) return null;

    return {
        sceneNumber,
        description: description.trim(),
        videoPrompt: videoPrompt.trim(),
        imagePrompt: imagePrompt.trim(),
        duration: duration.trim(),
        howToCreate: howToCreate.trim(),
        prompt: videoPrompt.trim(),
    };
}

function extractField(body: string, label: string): string {
    const regex = new RegExp(
        `${label}:\\s*([\\s\\S]*?)(?=\\n(?:VISUAL|VIDEO PROMPT|IMAGE PROMPT|PROMPT|DURATION|HOW TO CREATE|CREATE):|$)`,
        "i"
    );
    return body.match(regex)?.[1]?.trim() ?? "";
}

function extractInlineDescription(body: string, videoPrompt: string): string {
    const legacy = body.match(/^([\s\S]*?)\|\s*PROMPT:/i);
    if (legacy) return legacy[1].trim();
    const beforeLabel = body.split(/\n(?:VIDEO PROMPT|PROMPT|IMAGE PROMPT):/i)[0];
    const cleaned = beforeLabel?.replace(/\n/g, " ").trim() ?? "";
    if (cleaned && cleaned !== videoPrompt) return cleaned;
    return "";
}

function defaultHowToCreate(videoPrompt: string, imagePrompt: string): string {
    if (!videoPrompt && !imagePrompt) return "";
    const parts: string[] = [];
    if (videoPrompt) {
        parts.push(
            "Paste the Video Prompt into Pika or Runway → generate a short clip → use the suggested Duration."
        );
    }
    if (imagePrompt) {
        parts.push(
            "Paste the Image Prompt into Leonardo AI or Canva for a matching still image as backup."
        );
    }
    return parts.join(" ");
}

function extractLegacyScenes(text: string): SceneBlock[] {
    const sceneRegex =
        /SCENE\s+(\d+):\s*([\s\S]*?)\|\s*PROMPT:\s*([\s\S]*?)(?=\nSCENE\s+\d+:|\nTITLES:|\nCAPTION:|\nPRODUCTION GUIDE:|$)/gi;
    const scenes: SceneBlock[] = [];
    let match: RegExpExecArray | null;

    while ((match = sceneRegex.exec(text)) !== null) {
        const videoPrompt = match[3].trim();
        scenes.push({
            sceneNumber: parseInt(match[1], 10),
            description: match[2].trim(),
            videoPrompt,
            prompt: videoPrompt,
            imagePrompt: "",
            duration: "3–5 sec",
            howToCreate: defaultHowToCreate(videoPrompt, ""),
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

export function normalizeScenes(scenes: SceneBlock[]): SceneBlock[] {
    return scenes.map((s) => ({
        ...s,
        videoPrompt: s.videoPrompt || s.prompt || "",
        prompt: s.videoPrompt || s.prompt || "",
        imagePrompt: s.imagePrompt || "",
        duration: s.duration || "3–5 sec",
        howToCreate:
            s.howToCreate ||
            defaultHowToCreate(s.videoPrompt || s.prompt || "", s.imagePrompt || ""),
    }));
}
