// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// Despliegue en GitHub Pages como página de proyecto:
//   https://aedmadrid.github.io/aedm.astro/
//
// Si algún día se sirve en el dominio propio (aedm.org.es), basta con poner
// site: "https://aedm.org.es" y base: "/" y añadir public/CNAME.
export default defineConfig({
    site: "https://aedmadrid.github.io",
    base: "/aedm.astro",
    output: "static",
    integrations: [sitemap()],
    redirects: {},
});
