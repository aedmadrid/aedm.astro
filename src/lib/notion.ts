import {
    PRIMARY_API,
    FALLBACK_API,
    fetchWithTimeout,
    fetchJsonWithFallback,
} from "./api";

export interface NotionBlock {
    id: string;
    type: string;
    rich_text?: any[];
    checked?: boolean;
    url?: string;
    title?: string;
    caption?: any[];
    language?: string;
    [key: string]: any;
}

export interface NotionPage {
    current_page_title: string;
    blocks: NotionBlock[];
    tags?: string[];
}

export type FetchResult =
    | { ok: true; page: NotionPage; attempts: FetchAttempt[] }
    | { ok: false; notFound: boolean; attempts: FetchAttempt[] };

export interface FetchAttempt {
    host: "primary" | "fallback";
    timeoutMs: number;
    outcome: "ok" | "not_found" | "timeout" | "error";
    status?: number;
    error?: string;
}

const pageCache = new Map<string, NotionPage>();

async function tryFetch(
    host: "primary" | "fallback",
    pageId: string,
    timeoutMs: number,
): Promise<{
    page: NotionPage | null;
    attempt: FetchAttempt;
}> {
    const base = host === "primary" ? PRIMARY_API : FALLBACK_API;
    const url = `${base}/id/${pageId}.json`;
    try {
        const res = await fetchWithTimeout(url, timeoutMs);

        // La API actual responde con HTTP 500 + { error: "..." } cuando la
        // página no existe. Leemos el body siempre que se pueda y, si trae
        // { error }, lo tratamos como página no encontrada (no como error
        // del API), para no seguir quemando reintentos.
        let data: ({ error?: unknown } & Partial<NotionPage>) | null = null;
        try {
            data = (await res.json()) as {
                error?: unknown;
            } & Partial<NotionPage>;
        } catch {
            // body no era JSON; seguimos con data=null
        }

        const hasErrorPayload =
            data !== null &&
            typeof data === "object" &&
            "error" in data &&
            (data as { error?: unknown }).error !== undefined;

        if (res.status === 404 || hasErrorPayload) {
            return {
                page: null,
                attempt: {
                    host,
                    timeoutMs,
                    outcome: "not_found",
                    status: res.status,
                },
            };
        }
        if (!res.ok) {
            return {
                page: null,
                attempt: {
                    host,
                    timeoutMs,
                    outcome: "error",
                    status: res.status,
                },
            };
        }
        return {
            page: data as NotionPage,
            attempt: { host, timeoutMs, outcome: "ok", status: res.status },
        };
    } catch (err) {
        const aborted =
            err instanceof Error &&
            (err.name === "AbortError" || err.name === "TimeoutError");
        return {
            page: null,
            attempt: {
                host,
                timeoutMs,
                outcome: aborted ? "timeout" : "error",
                error: err instanceof Error ? err.message : String(err),
            },
        };
    }
}

/**
 * Obtiene una página de Notion a través de la API principal con fallback.
 *
 * Secuencia de reintentos (por intento, timeout individual):
 *   1. api.aedm.org.es          -> 8s
 *   2. aedm-cora.onrender.com   -> 120s (Render free, arranque en frío)
 *   3. api.aedm.org.es          -> 15s
 *   4. aedm-cora.onrender.com   -> 30s
 */
export async function fetchNotionPage(
    pageId: string,
): Promise<FetchResult> {
    const cached = pageCache.get(pageId);
    if (cached) {
        return { ok: true, page: cached, attempts: [] };
    }

    const sequence: Array<{ host: "primary" | "fallback"; timeoutMs: number }> =
        [
            { host: "primary", timeoutMs: 8_000 },
            { host: "fallback", timeoutMs: 120_000 },
            { host: "primary", timeoutMs: 15_000 },
            { host: "fallback", timeoutMs: 30_000 },
        ];

    const attempts: FetchAttempt[] = [];

    for (const step of sequence) {
        const { page, attempt } = await tryFetch(
            step.host,
            pageId,
            step.timeoutMs,
        );
        attempts.push(attempt);

        if (attempt.outcome === "ok" && page) {
            pageCache.set(pageId, page);
            return { ok: true, page, attempts };
        }

        if (attempt.outcome === "not_found") {
            return { ok: false, notFound: true, attempts };
        }
    }

    return { ok: false, notFound: false, attempts };
}

const DB_PATHS = [
    "/ACTIVIDADES_DB.json",
    "/PROYECTOS_DB.json",
    "/WEB_DB.json",
    "/ESCUELA_DB.json",
    "/AEDM_DB.json",
    "/INICIO_DB.json",
];

function collectDbPageIds(db: unknown): string[] {
    const ids = new Set<string>();
    const seen = new Set<unknown>();

    const visit = (node: any) => {
        if (!node || typeof node !== "object" || seen.has(node)) return;
        seen.add(node);

        if (Array.isArray(node)) {
            for (const value of node) visit(value);
            return;
        }

        for (const [key, value] of Object.entries(node)) {
            if (typeof value === "string") {
                if (key === "pageId" || key === "page_id") {
                    ids.add(normalizePageId(value));
                } else {
                    const match =
                        value.match(/(?:^|\/)(?:id|app\/i)\/([0-9a-f-]{32,36})/i) ||
                        value.match(/^\/([0-9a-f]{32})/i);
                    if (match) ids.add(normalizePageId(match[1]));
                }
            }
            visit(value);
        }
    };

    visit(db);
    return [...ids];
}

/**
 * Normaliza un id de página de Notion a la forma con guiones. La API acepta
 * ambas formas, pero las URLs de Notion suelen venir sin guiones (32 hex).
 */
export function normalizePageId(value: string): string {
    const hex = value.replace(/[^0-9a-f]/gi, "").toLowerCase();
    if (hex.length === 32) {
        return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
    }
    return value;
}

/**
 * Extrae el id de página de un enlace interno de Notion: `/id/<id>`,
 * `/<id>` (sin guiones), o una URL de notion.so/notion.site. Devuelve null
 * para cualquier otro enlace.
 */
export function pageIdFromHref(href: string): string | null {
    const value = href.trim();

    let match = value.match(/^\/id\/([0-9a-f-]{32,36})\/?(?:[?#].*)?$/i);
    if (match) return normalizePageId(match[1]);

    match = value.match(/^\/([0-9a-f]{32})\/?(?:[?#].*)?$/i);
    if (match) return normalizePageId(match[1]);

    match = value.match(
        /^https?:\/\/[^/]*notion\.(?:so|site)\/[^\s?#]*-([0-9a-f]{32})/i,
    );
    if (match) return normalizePageId(match[1]);

    return null;
}

function collectPageRefs(page: NotionPage): string[] {
    const refs = new Set<string>();
    const seen = new Set<unknown>();

    const visit = (node: any) => {
        if (!node || typeof node !== "object" || seen.has(node)) return;
        seen.add(node);

        if (Array.isArray(node)) {
            for (const value of node) visit(value);
            return;
        }

        if (typeof node.href === "string") {
            const id = pageIdFromHref(node.href);
            if (id) refs.add(id);
        }

        if (typeof node.mention?.page?.id === "string") {
            refs.add(normalizePageId(node.mention.page.id));
        }

        if (node.type === "child_page" || node.type === "link_to_page") {
            if (typeof node.id === "string") refs.add(normalizePageId(node.id));
            if (typeof node.page_id === "string")
                refs.add(normalizePageId(node.page_id));
        }

        for (const value of Object.values(node)) visit(value);
    };

    visit(page.blocks);
    return [...refs];
}

/**
 * Descubre todas las páginas que hay que pre-generar: los pageId de las bases
 * de datos más las páginas referenciadas desde su contenido (child_page,
 * link_to_page, enlaces y menciones en rich_text), de forma recursiva.
 * Devuelve solo las que se han podido descargar.
 */
export async function discoverPageIds(): Promise<string[]> {
    const seeds: string[] = [];
    for (const path of DB_PATHS) {
        try {
            const db = await fetchJsonWithFallback<unknown>(path);
            seeds.push(...collectDbPageIds(db));
        } catch (err) {
            console.warn(
                `[notion] no se pudo leer ${path}:`,
                err instanceof Error ? err.message : err,
            );
        }
    }

    const found: string[] = [];
    const visited = new Set<string>();
    const queue = seeds.slice();

    while (queue.length) {
        const id = queue.shift() as string;
        if (visited.has(id)) continue;
        visited.add(id);

        const result = await fetchNotionPage(id);
        if (!result.ok) continue;

        found.push(id);
        for (const ref of collectPageRefs(result.page)) {
            if (!visited.has(ref)) queue.push(ref);
        }
    }

    return found;
}
