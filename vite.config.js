import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { blogContentPlugin } from "./scripts/blog-content-plugin.js";

const buildTime = new Date().toISOString();

export default defineConfig({
	plugins: [blogContentPlugin({ buildTime }), sveltekit()],
	// Posts import sticker components through virtual blog modules that the dependency scanner cannot crawl.
	// Prebundling them on first request would force a full page reload in the dev server.
	optimizeDeps: { exclude: ["@cofob2/design-system-stickers"] },
});
