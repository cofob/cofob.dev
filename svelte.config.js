import preprocess from "svelte-preprocess";
import cf_adapter from "@sveltejs/adapter-cloudflare";
import static_adapter from "@sveltejs/adapter-static";
import node_adapter from "@sveltejs/adapter-node";

let adapter;
switch (process.env.DEPLOY_TARGET) {
	case "cloudflare":
		adapter = cf_adapter();
		break;
	case "static":
		adapter = static_adapter({ fallback: "200.html" });
		break;
	case "node":
		adapter = node_adapter({ precompress: true });
		break;
	default:
		adapter = static_adapter({ fallback: "200.html" });
}

const get_css_hash = ({ css, hash }) => {
	return `css-${hash(css)}`;
};

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [
		preprocess({
			postcss: true,
		}),
	],

	compilerOptions: {
		cssHash: get_css_hash,
	},

	kit: {
		adapter,

		alias: {
			$src: "src",
			$components: "src/lib/components",
		},

		trailingSlash: "always",
	},
};

export default config;
