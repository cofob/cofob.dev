import { getPublicPosts } from "$lib/blog/catalog";
import { collectTags, filterPostsByTag, paginatePosts, parsePage } from "$lib/blog/list";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = ({ setHeaders, url }) => {
	setHeaders({ "cache-control": "public, max-age=300" });
	const allPosts = getPublicPosts();
	const searchParameters = process.env.DEPLOY_TARGET === "static" ? undefined : url.searchParams;
	const requestedTag = searchParameters?.get("tag")?.trim() ?? "";
	const canonicalTag =
		collectTags(allPosts).find((tag) => tag.toLocaleLowerCase() === requestedTag.toLocaleLowerCase()) ?? "";
	const filtered = filterPostsByTag(allPosts, canonicalTag || requestedTag);
	const pagination = paginatePosts(filtered, parsePage(searchParameters?.get("page") ?? null));

	return {
		posts: pagination.posts,
		tags: collectTags(allPosts),
		selectedTag: canonicalTag || requestedTag,
		page: pagination.page,
		pageCount: pagination.pageCount,
		total: pagination.total,
	};
};
