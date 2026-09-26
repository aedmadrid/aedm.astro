// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Despliegue en GitHub Pages con dominio propio (aedm.org.es).
export default defineConfig({
    site: "https://aedm.org.es",
    base: "/",
    output: "static",
    integrations: [sitemap()],
    redirects: {},
});
