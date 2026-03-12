// @ts-check
import { defineConfig } from "astro/config";
import node from "@astrojs/node";

export default defineConfig({
  site: "https://aedm.org.es",
  output: "static",
  adapter: node({
    mode: "standalone",
  }),
});
