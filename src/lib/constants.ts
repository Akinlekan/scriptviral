import type { Genre, Platform, Tone, VideoLength, IncludeOption } from "@/types";

export const GENRES: { value: Genre; label: string }[] = [
    { value: "true_crime", label: "True crime" },
    { value: "motivational", label: "Motivational" },
    { value: "conspiracy", label: "Conspiracy / shocking facts" },
    { value: "relationship_drama", label: "Relationship drama" },
    { value: "dark_mystery", label: "Dark mystery" },
    { value: "rags_to_riches", label: "Rags to riches" },
    { value: "fitness_weight_loss", label: "Fitness and weight loss" },
    { value: "personal_finance", label: "Personal finance and investing" },
    { value: "faith_spirituality", label: "Faith and spirituality" },
    { value: "parenting_childcare", label: "Parenting and childcare" },
];

export const PLATFORMS: { value: Platform; label: string }[] = [
    { value: "youtube_longform", label: "YouTube longform" },
    { value: "tiktok_reels", label: "TikTok / Reels" },
    { value: "both", label: "Both (full + short version)" },
];

export const TONES: { value: Tone; label: string }[] = [
    { value: "suspenseful", label: "Suspenseful" },
    { value: "shocking_bold", label: "Shocking / bold" },
    { value: "emotional", label: "Emotional" },
    { value: "curious_investigative", label: "Curious / investigative" },
    { value: "motivational", label: "Motivational" },
];

export const VIDEO_LENGTHS: { value: VideoLength; label: string }[] = [
    { value: "short", label: "Short (60–90 sec)" },
    { value: "medium", label: "Medium (5–8 min YouTube)" },
    { value: "long", label: "Long (10–15 min)" },
];

export const INCLUDE_OPTIONS: { value: IncludeOption; label: string }[] = [
    { value: "hook", label: "Hook" },
    { value: "full_script", label: "Full narration script" },
    { value: "scene_prompts", label: "Scene-by-scene production guide" },
    { value: "titles", label: "5 viral title ideas" },
    { value: "caption", label: "Social media caption" },
];

export const GENRE_LABELS = Object.fromEntries(
    GENRES.map((g) => [g.value, g.label])
) as Record<Genre, string>;

export const PLATFORM_LABELS = Object.fromEntries(
    PLATFORMS.map((p) => [p.value, p.label])
) as Record<Platform, string>;

export const LENGTH_GUIDES: Record<VideoLength, string> = {
    short: "60–90 seconds (TikTok/Reels pacing, ~150–250 words)",
    medium: "5–8 minutes YouTube (800–1200 words)",
    long: "10–15 minutes YouTube (1500–2200 words)",
};
