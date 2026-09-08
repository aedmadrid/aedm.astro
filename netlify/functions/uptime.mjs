// Estado de los servicios para la página /fail (monitor de uptime).
// Corre como función serverless de Netlify y comprueba cada servicio desde la
// red, leyendo el código HTTP real. Así distinguimos "alcanzable pero caído"
// (p. ej. Cloudflare devuelve 530 cuando el origen está caído) de un fallo de
// red. Un simple fetch desde el navegador no puede ver el 530 (CORS/no-cors).

const URLS = [
    "https://aedm.org.es/",
    "https://api.aedm.org.es/",
    "https://api.failback.aedm.org.es/",
    "https://verificaso.aedm.org.es/login",
    "https://ideaso.aedm.org.es/",
    "https://encuestaso.aedm.org.es/",
];

const TIMEOUT_MS = 8000;
const CACHE_TTL_MS = 30000; // evita machacar los orígenes con cada visitante

let cache = { ts: 0, data: null };

export async function handler(event) {
    if (event.httpMethod !== "GET") {
        return json({ error: "method not allowed" }, 405);
    }

    const now = Date.now();
    if (cache.data && now - cache.ts < CACHE_TTL_MS) {
        return json(cache.data);
    }

    const results = {};
    await Promise.all(
        URLS.map(async (url) => {
            results[url] = await probe(url);
        }),
    );

    const payload = { results, checkedAt: new Date().toISOString() };
    cache = { ts: Date.now(), data: payload };
    return json(payload);
}

async function probe(url) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
    const start = Date.now();
    try {
        const res = await fetch(url, {
            method: "GET",
            redirect: "follow",
            signal: controller.signal,
            headers: { "user-agent": "aedm-uptime/1.0" },
        });
        // Drenamos el cuerpo para liberar la conexión.
        await res.arrayBuffer();
        return {
            ok: res.ok,
            status: res.status,
            ms: Date.now() - start,
            error: null,
        };
    } catch (err) {
        return {
            ok: false,
            status: null,
            ms: Date.now() - start,
            error: err.name === "AbortError" ? "timeout" : "unreachable",
        };
    } finally {
        clearTimeout(timer);
    }
}

function json(body, status = 200) {
    return {
        statusCode: status,
        headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
        },
        body: JSON.stringify(body),
    };
}
