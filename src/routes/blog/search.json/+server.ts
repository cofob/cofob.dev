import { json } from "@sveltejs/kit";
import { getPublicPosts } from "$lib/blog/catalog";
import type { SearchPost } from "$lib/blog/types";

export const prerender = true;

export function GET() {
	const posts: SearchPost[] = getPublicPosts().map(({ slug, title, description, published, updated, lang, tags }) => ({
		slug,
		title,
		description,
		published,
		updated,
		lang,
		tags,
	}));

	return json(posts, {
		headers: { "Cache-Control": "public, max-age=300, stale-while-revalidate=3600" },
	});
}
