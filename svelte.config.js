import { vitePreprocess } from "@sveltejs/vite-plugin-svelte";
import { code_highlighter, mdsvex } from "mdsvex";
import remarkGfm from "remark-gfm";
import { rehypeAccessibleScrollableContent } from "./scripts/mdsvex-accessibility.js";
import cloudflareAdapter from "@sveltejs/adapter-cloudflare";
import nodeAdapter from "@sveltejs/adapter-node";

function getAdapter() {
	switch (process.env.DEPLOY_TARGET) {
		case "cloudflare":
			return cloudflareAdapter();
		case "node":
			return nodeAdapter({ precompress: true });
		default:
			return nodeAdapter({ precompress: true });
	}
}

async function accessibleCodeHighlighter(...arguments_) {
	const highlighted = await code_highlighter(...arguments_);
	const language = arguments_[1] ? ` in ${String(arguments_[1]).replaceAll('"', "&quot;")}` : "";
	return highlighted.replace(
		"<pre",
		`<!-- svelte-ignore a11y_no_noninteractive_tabindex --><pre tabindex="0" role="region" aria-label="Scrollable code example${language}"`,
	);
}

/** @type {import('@sveltejs/kit').Config} */
const config = {
	extensions: [".svelte", ".md"],
	preprocess: [
		vitePreprocess(),
		mdsvex({
			extensions: [".md"],
			remarkPlugins: [remarkGfm],
			rehypePlugins: [rehypeAccessibleScrollableContent],
			highlight: { highlighter: accessibleCodeHighlighter },
		}),
	],
	compilerOptions: {
		cssHash: ({ css, hash }) => `css-${hash(css)}`,
	},
	kit: {
		adapter: getAdapter(),
		...(process.env.BLOG_ASSETS_PREPARED === "1"
			? {
					files: {
						assets: ".blog-build/static",
					},
				}
			: {}),
		alias: {
			$src: "src",
			$components: "src/lib/components",
		},
		inlineStyleThreshold: 1024 * 16,
		prerender: {
			entries: ["*"],
			handleUnseenRoutes({ routes, message }) {
				const unexpected = routes.filter((route) => route !== "/blog/[slug]");
				if (unexpected.length > 0) throw new Error(message);
			},
		},
	},
};

export default config;
