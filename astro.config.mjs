// @ts-check
import { defineConfig } from "astro/config";
import netlify from "@astrojs/netlify";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
    site: "https://aedm.org.es",
    output: "static",
    adapter: netlify({
        edgeMiddleware: false,
    }),
    integrations: [sitemap()],
    redirects: {},
});
