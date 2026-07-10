import { getPublicPosts } from "$lib/blog/catalog";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ setHeaders }) => {
	setHeaders({ "cache-control": "public, max-age=300" });
	return { posts: getPublicPosts() };
};
