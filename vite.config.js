import child_process from "child_process";
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
	define: {
		"import.meta.env.VITE_VERSION": JSON.stringify(
			child_process.execSync("git describe --tags --abbrev=0 --always").toString().trim(),
		),
	},
	plugins: [sveltekit()],
};

export default config;
