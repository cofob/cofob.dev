import { sveltekit } from "@sveltejs/kit/vite";

const get_css_hash = ({ css, hash }) => {
	return `${hash(css)}`;
};

/**
 * @type {import('vite').UserConfig}
 */
const config = {
	compilerOptions: {
		cssHash: get_css_hash,
	},
	plugins: [sveltekit()],
};

export default config;
