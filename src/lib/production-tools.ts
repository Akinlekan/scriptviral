export const FREE_VISUAL_TOOLS = [
    {
        name: "Pika",
        use: "AI video clips",
        url: "https://pika.art",
    },
    {
        name: "Runway",
        use: "AI video (Gen-3)",
        url: "https://runwayml.com",
    },
    {
        name: "Leonardo AI",
        use: "AI images & motion",
        url: "https://leonardo.ai",
    },
    {
        name: "CapCut",
        use: "Free video editor",
        url: "https://www.capcut.com",
    },
    {
        name: "Canva",
        use: "Images & simple video",
        url: "https://www.canva.com",
    },
] as const;

export const PRODUCTION_WORKFLOW_STEPS = [
    "Generate each scene clip using the Video Prompt (Pika, Runway, or Leonardo Motion).",
    "Generate backup stills with the Image Prompt if a video clip doesn't look right.",
    "Import clips into CapCut or DaVinci Resolve in scene order (Scene 1 → last).",
    "Record your narration using the Script tab — match clip length to each scene's Duration.",
    "Add captions, music, and export in 9:16 (TikTok/Reels) or 16:9 (YouTube).",
];
