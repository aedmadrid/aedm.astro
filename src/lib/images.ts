const BLOCKED_IMAGE_HOSTS = ["imgbox.com"];

const FALLBACK_IMAGE = "/img/no-disponible.svg";

export function safeImage(url?: string | null, fallback = FALLBACK_IMAGE): string {
    const value = (url ?? "").trim();
    if (!value) return fallback;

    try {
        const host = new URL(value).hostname.toLowerCase();
        if (
            BLOCKED_IMAGE_HOSTS.some(
                (blocked) => host === blocked || host.endsWith("." + blocked),
            )
        ) {
            return fallback;
        }
    } catch {
        // Es una ruta relativa; se deja tal cual.
    }

    return value;
}
