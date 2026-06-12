import type { SceneBlock } from "@/types";

const USAGE_KEY = "scriptviral_usage_count";
const SCRIPTS_KEY = "scriptviral_saved_scripts";

export interface LocalSavedScript {
    id: string;
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

export function getUsageCount(): number {
    if (typeof window === "undefined") return 0;
    const raw = localStorage.getItem(USAGE_KEY);
    return raw ? parseInt(raw, 10) || 0 : 0;
}

export function incrementUsageCount(): number {
    const next = getUsageCount() + 1;
    localStorage.setItem(USAGE_KEY, String(next));
    return next;
}

export function getSavedScripts(): LocalSavedScript[] {
    if (typeof window === "undefined") return [];
    try {
        const raw = localStorage.getItem(SCRIPTS_KEY);
        return raw ? (JSON.parse(raw) as LocalSavedScript[]) : [];
    } catch {
        return [];
    }
}

function persistScripts(scripts: LocalSavedScript[]) {
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
}

export function saveScript(
    script: Omit<LocalSavedScript, "id" | "created_at">
): LocalSavedScript {
    const entry: LocalSavedScript = {
        ...script,
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
    };
    const scripts = getSavedScripts();
    scripts.unshift(entry);
    persistScripts(scripts);
    return entry;
}

export function renameScript(id: string, title: string): void {
    const scripts = getSavedScripts().map((s) =>
        s.id === id ? { ...s, title } : s
    );
    persistScripts(scripts);
}

export function deleteScript(id: string): void {
    persistScripts(getSavedScripts().filter((s) => s.id !== id));
}
