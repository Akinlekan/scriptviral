import type { SceneBlock, GeneratedScript } from "@/types";
import { normalizeScenes } from "@/lib/parse-script";

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
    titles: string[];
    caption: string;
    productionGuide: string;
    created_at: string;
}

function normalizeSavedScript(raw: Record<string, unknown>): LocalSavedScript {
    const titlesRaw = raw.titles;
    const titles = Array.isArray(titlesRaw)
        ? (titlesRaw as string[])
        : typeof titlesRaw === "string"
          ? titlesRaw.split("\n").filter(Boolean)
          : [];

    return {
        id: String(raw.id ?? ""),
        title: String(raw.title ?? "Untitled Script"),
        genre: String(raw.genre ?? ""),
        platform: String(raw.platform ?? ""),
        tone: String(raw.tone ?? ""),
        hook: String(raw.hook ?? ""),
        script: String(raw.script ?? ""),
        scenes: normalizeScenes((raw.scenes as SceneBlock[]) ?? []),
        titles,
        caption: String(raw.caption ?? ""),
        productionGuide: String(raw.productionGuide ?? ""),
        created_at: String(raw.created_at ?? new Date().toISOString()),
    };
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
        if (!raw) return [];
        const parsed = JSON.parse(raw) as Record<string, unknown>[];
        return parsed.map(normalizeSavedScript);
    } catch {
        return [];
    }
}

export function getScriptById(id: string): LocalSavedScript | null {
    return getSavedScripts().find((s) => s.id === id) ?? null;
}

function persistScripts(scripts: LocalSavedScript[]) {
    localStorage.setItem(SCRIPTS_KEY, JSON.stringify(scripts));
}

export function saveScript(
    script: Omit<LocalSavedScript, "id" | "created_at">
): LocalSavedScript {
    const entry: LocalSavedScript = {
        ...script,
        scenes: normalizeScenes(script.scenes),
        id: crypto.randomUUID(),
        created_at: new Date().toISOString(),
    };
    const scripts = getSavedScripts();
    scripts.unshift(entry);
    persistScripts(scripts);
    return entry;
}

export function updateScript(
    id: string,
    script: Omit<LocalSavedScript, "id" | "created_at">
): LocalSavedScript | null {
    let updated: LocalSavedScript | null = null;
    const scripts = getSavedScripts().map((s) => {
        if (s.id !== id) return s;
        updated = {
            ...s,
            ...script,
            scenes: normalizeScenes(script.scenes),
        };
        return updated;
    });
    if (!updated) return null;
    persistScripts(scripts);
    return updated;
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

export function savedScriptToGenerated(
    script: LocalSavedScript
): GeneratedScript {
    return {
        hook: script.hook,
        script: script.script,
        scenes: normalizeScenes(script.scenes),
        titles: script.titles,
        caption: script.caption,
        productionGuide: script.productionGuide,
    };
}

export function buildSavePayload(
    result: GeneratedScript,
    meta: { genre: string; platform: string; tone: string }
): Omit<LocalSavedScript, "id" | "created_at"> {
    return {
        title:
            result.titles[0] ||
            result.hook.slice(0, 60) ||
            "Untitled Script",
        genre: meta.genre,
        platform: meta.platform,
        tone: meta.tone,
        hook: result.hook,
        script: result.script,
        scenes: normalizeScenes(result.scenes),
        titles: result.titles,
        caption: result.caption,
        productionGuide: result.productionGuide ?? "",
    };
}
