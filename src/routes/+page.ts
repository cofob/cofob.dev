import type { PageLoad } from "./$types";
import { getPublicPosts } from "$lib/blog/catalog";

export const ssr = true;

export const load: PageLoad = async ({ setHeaders }) => {
	setHeaders({
		"cache-control": "public, max-age=300",
	});

	return { latestPost: getPublicPosts()[0] };
};
