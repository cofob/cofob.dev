import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import cloudflareAdapter from "@sveltejs/adapter-cloudflare";
import staticAdapter from "@sveltejs/adapter-static";
import nodeAdapter from "@sveltejs/adapter-node";

function getAdapter() {
	switch (process.env.DEPLOY_TARGET) {
		case "cloudflare":
			return cloudflareAdapter();
		case "static":
			return staticAdapter({ fallback: "200.html" });
		case "node":
			return nodeAdapter({ precompress: true });
		default:
			return staticAdapter({ fallback: "200.html" });
	}
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	compilerOptions: {
		cssHash: ({ css, hash }) => `css-${hash(css)}`,
	},
	kit: {
		adapter: getAdapter(),
		alias: {
			$src: "src",
			$components: "src/lib/components",
		},
		inlineStyleThreshold: 1024 * 16,
		prerender: {
			entries: ["*"],
		},
	},
};

export default config;
