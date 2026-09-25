export const PRIMARY_API = "https://api.aedm.org.es";
export const FALLBACK_API = "https://aedm-cora.onrender.com";

export const PRIMARY_TIMEOUT_MS = 8_000;
export const FALLBACK_TIMEOUT_MS = 60_000;

export function fetchWithTimeout(
    url: string,
    timeoutMs: number,
): Promise<Response> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);
    return fetch(url, { signal: controller.signal }).finally(() =>
        clearTimeout(timer),
    );
}

async function fetchJsonOnce<T>(
    base: string,
    path: string,
    timeoutMs: number,
): Promise<T> {
    const res = await fetchWithTimeout(`${base}${path}`, timeoutMs);
    if (!res.ok) {
        throw new Error(`HTTP ${res.status} en ${base}${path}`);
    }
    return (await res.json()) as T;
}

export async function fetchJsonWithFallback<T>(path: string): Promise<T> {
    try {
        return await fetchJsonOnce<T>(PRIMARY_API, path, PRIMARY_TIMEOUT_MS);
    } catch (err) {
        console.warn(
            `[api] principal falló (${path}), usando fallback:`,
            err instanceof Error ? err.message : err,
        );
    }
    return await fetchJsonOnce<T>(FALLBACK_API, path, FALLBACK_TIMEOUT_MS);
}
