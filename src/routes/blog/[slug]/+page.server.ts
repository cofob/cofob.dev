import { dev } from "$app/environment";
import { error } from "@sveltejs/kit";
import { getPost, getPublicPostEntries } from "$lib/blog/catalog";
import { getServerComments } from "$lib/server/fediverse-comments";
import type { EntryGenerator, PageServerLoad } from "./$types";

export const entries: EntryGenerator = () => getPublicPostEntries();

export const load: PageServerLoad = async ({ params, fetch, setHeaders }) => {
	const post = getPost(params.slug);
	if (!post || (!dev && !post.isPublic)) error(404, "Post not found");

	setHeaders({ "cache-control": "public, max-age=300, stale-while-revalidate=600" });
	const commentMode: "manual" | "automatic" = process.env.DEPLOY_TARGET === "static" ? "manual" : "automatic";
	const comments =
		post.comments && commentMode === "automatic" ? await getServerComments(post.comments, fetch) : undefined;

	return { post, commentMode, comments };
};
