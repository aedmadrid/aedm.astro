// @ts-check
import { defineConfig } from "astro/config";
import cloudflare from "@astrojs/cloudflare";
import sitemap from "@astrojs/sitemap";

export default defineConfig({
  site: "https://aedm.org.es",
  output: "static",
  adapter: cloudflare(),
  integrations: [sitemap()],
  redirects: {},
});
