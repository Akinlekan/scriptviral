import { GoogleGenerativeAI } from "@google/generative-ai";
import {
    GENRE_LABELS,
    PLATFORM_LABELS,
    LENGTH_GUIDES,
    TONES,
} from "@/lib/constants";
import type { GenerateRequest } from "@/types";

/** Free-tier models, best options first (avoid gemini-2.0-flash — often 0 quota). */
const MODEL_FALLBACK_CHAIN = [
    "gemini-2.5-flash-lite",
    "gemini-2.5-flash",
    "gemini-1.5-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash-8b",
] as const;

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

function getModelChain(): string[] {
    const preferred = process.env.GEMINI_MODEL?.trim();
    if (!preferred) return [...MODEL_FALLBACK_CHAIN];
    return [
        preferred,
        ...MODEL_FALLBACK_CHAIN.filter((m) => m !== preferred),
    ];
}

function isRetryableError(message: string): boolean {
    return (
        message.includes("429") ||
        message.includes("503") ||
        message.includes("quota") ||
        message.includes("Quota exceeded") ||
        message.includes("RESOURCE_EXHAUSTED") ||
        message.includes("not found") ||
        message.includes("404")
    );
}

function parseRetrySeconds(message: string): number {
    const match = message.match(/retry in (\d+(?:\.\d+)?)s/i);
    if (match) return Math.ceil(parseFloat(match[1]));
    const delayMatch = message.match(/"retryDelay":"(\d+)s"/);
    if (delayMatch) return parseInt(delayMatch[1], 10);
    return 35;
}

function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

async function tryGenerate(
    genAI: GoogleGenerativeAI,
    modelName: string,
    prompt: string
): Promise<string> {
    const model = genAI.getGenerativeModel({ model: modelName });
    const result = await model.generateContent(prompt);
    const text = result.response.text();
    if (!text?.trim()) {
        throw new Error(`Empty response from ${modelName}`);
    }
    return text;
}

export async function generateScriptText(
    input: GenerateRequest
): Promise<string> {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
        throw new Error("GEMINI_API_KEY is not configured");
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const prompt = buildPrompt(input);
    const models = getModelChain();
    const failures: string[] = [];

    for (let i = 0; i < models.length; i++) {
        const modelName = models[i];
        try {
            return await tryGenerate(genAI, modelName, prompt);
        } catch (error) {
            const message =
                error instanceof Error ? error.message : String(error);
            failures.push(`${modelName}: ${message.slice(0, 120)}`);
            console.warn(`Gemini model ${modelName} failed:`, message);

            if (!isRetryableError(message)) {
                throw error;
            }

            const isLast = i === models.length - 1;
            if (isLast && message.includes("429")) {
                const waitSec = parseRetrySeconds(message);
                await sleep(Math.min(waitSec * 1000, 45000));
                try {
                    return await tryGenerate(genAI, modelName, prompt);
                } catch (retryError) {
                    const retryMsg =
                        retryError instanceof Error
                            ? retryError.message
                            : String(retryError);
                    failures.push(`${modelName} (retry): ${retryMsg.slice(0, 120)}`);
                }
            }
        }
    }

    throw new Error(
        "AI rate limit reached on all free models. Wait 1–2 minutes and try again, " +
            "or create a new API key at https://aistudio.google.com/apikey (new Google Cloud project = fresh quota). " +
            `Tried: ${models.join(", ")}`
    );
}
