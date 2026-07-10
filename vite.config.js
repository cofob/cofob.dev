import { sveltekit } from "@sveltejs/kit/vite";
import { defineConfig } from "vite";
import { blogContentPlugin } from "./scripts/blog-content-plugin.js";

const buildTime = new Date().toISOString();

export default defineConfig({
	plugins: [blogContentPlugin({ buildTime }), sveltekit()],
});
