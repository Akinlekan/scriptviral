import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    GENRE_LABELS,
    PLATFORM_LABELS,
    LENGTH_GUIDES,
    TONES,
} from "@/lib/constants";
import type { GenerateRequest } from "@/types";

function getToneLabel(tone: GenerateRequest["tone"]): string {
    return TONES.find((t) => t.value === tone)?.label ?? tone;
}

export function buildPrompt(input: GenerateRequest): string {
    const genreLabel = GENRE_LABELS[input.genre];
    const platformLabel = PLATFORM_LABELS[input.platform];
    const toneLabel = getToneLabel(input.tone);
    const lengthGuide = LENGTH_GUIDES[input.videoLength];
    const topic =
        input.topic?.trim() ||
        "auto-generate a gripping original story";

    const includeList = input.include
        .map((item) => {
            switch (item) {
                case "hook":
                    return "HOOK";
                case "full_script":
                    return "SCRIPT";
                case "scene_prompts":
                    return "SCENE blocks with PROMPT";
                case "titles":
                    return "TITLES";
                case "caption":
                    return "CAPTION";
                default:
                    return item;
            }
        })
        .join(", ");

    return `You are a viral content scriptwriter. Generate a complete ${toneLabel} ${genreLabel} story for ${platformLabel}.

Story topic: ${topic}
Target length: ${lengthGuide}

Generate ALL of the following in order (include: ${includeList}):
HOOK: [1-3 sentence scroll-stopping hook]
SCRIPT: [full narration with pacing notes like [pause] [lower voice]]

For each scene (6-12 total), use EXACTLY this multi-line format:
SCENE 1:
VISUAL: [what the viewer sees — subject, setting, action]
VIDEO PROMPT: [detailed AI video prompt: camera angle, lens, lighting, subject, action, mood, color palette — ready to paste into Runway/Pika]
IMAGE PROMPT: [detailed AI still-image prompt matching the scene — ready to paste into Leonardo/Canva/Midjourney]
DURATION: [suggested clip length e.g. "4 sec" — must match narration pacing]
HOW TO CREATE: [2-3 sentences: which free tool to use, exact steps, aspect ratio 9:16 or 16:9 based on platform, and how to match narration]

SCENE 2:
VISUAL: ...
VIDEO PROMPT: ...
IMAGE PROMPT: ...
DURATION: ...
HOW TO CREATE: ...

PRODUCTION GUIDE:
[5-7 numbered steps telling the user exactly how to assemble the final video: generate all clips → import to CapCut → record narration from SCRIPT → sync clips to narration beats → add captions → export settings for their platform]

TITLES: [5 viral title options, one per line, numbered 1-5]
CAPTION: [social caption + 10 hashtags]

Rules:
- Never start the hook with "In" or "Today"
- Punchy, short sentences
- Real emotional beats
- VIDEO PROMPT and IMAGE PROMPT must be copy-paste ready for AI tools
- HOW TO CREATE must mention specific free tools (Pika, Runway, Leonardo, CapCut)
- PRODUCTION GUIDE must be actionable for a beginner with no filming experience
- Feel like a real human story, not AI-generated
- Use the exact labels HOOK:, SCRIPT:, SCENE N:, VISUAL:, VIDEO PROMPT:, IMAGE PROMPT:, DURATION:, HOW TO CREATE:, PRODUCTION GUIDE:, TITLES:, CAPTION:`;
}

export async function generateScriptText(
    input: GenerateRequest
): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const prompt = buildPrompt(input);
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    if (!text) {
        throw new Error("Empty response from AI model");
    }

    return text;
}
