export type Genre =
    | "true_crime"
    | "motivational"
    | "conspiracy"
    | "relationship_drama"
    | "dark_mystery"
    | "rags_to_riches"
    | "fitness_weight_loss"
    | "personal_finance"
    | "faith_spirituality"
    | "parenting_childcare";

export type Platform = "youtube_longform" | "tiktok_reels" | "both";

export type Tone =
    | "suspenseful"
    | "shocking_bold"
    | "emotional"
    | "curious_investigative"
    | "motivational";

export type VideoLength = "short" | "medium" | "long";

export type IncludeOption =
    | "hook"
    | "full_script"
    | "scene_prompts"
    | "titles"
    | "caption";

export interface SceneBlock {
    sceneNumber: number;
    description: string;
    /** @deprecated use videoPrompt — kept for saved scripts compatibility */
    prompt?: string;
    videoPrompt: string;
    imagePrompt: string;
    duration: string;
    howToCreate: string;
}

export interface GeneratedScript {
    hook: string;
    script: string;
    scenes: SceneBlock[];
    titles: string[];
    caption: string;
    productionGuide: string;
}

export interface GenerateRequest {
    genre: Genre;
    platform: Platform;
    tone: Tone;
    videoLength: VideoLength;
    topic?: string;
    include: IncludeOption[];
}

export interface SavedScript {
    id: string;
    user_id: string;
    title: string;
    genre: string;
    platform: string;
    tone: string;
    hook: string;
    script: string;
    scenes: SceneBlock[];
    titles: string;
    caption: string;
    created_at: string;
}

export interface UsageRecord {
    id: string;
    user_id: string;
    month_year: string;
    count: number;
}
