import type { PageLoad } from "./$types";

export const ssr = true;

export const load: PageLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "public, max-age=300",
	});
};
