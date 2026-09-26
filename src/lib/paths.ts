const BASE = import.meta.env.BASE_URL;

const EXTERNAL_RE = /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i;

export function link(path?: string | null): string {
    const value = (path ?? "").trim();
    if (!value) return BASE;
    if (value.startsWith("#")) return value;

    const local = value.replace(
        /^https?:\/\/(?:www\.)?aedm\.org\.es(?=\/|$)/i,
        "",
    );
    if (local !== value) return link(local);

    if (EXTERNAL_RE.test(value)) return value;

    return BASE.replace(/\/+$/, "") + "/" + value.replace(/^\/+/, "");
}
