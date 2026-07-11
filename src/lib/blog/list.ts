import type { PostSummary } from "./types";

export const BLOG_PAGE_SIZE = 10;

export function collectTags(posts: PostSummary[]): string[] {
	const tags = new Map<string, string>();
	for (const tag of posts.flatMap((post) => post.tags)) {
		const normalized = tag.toLocaleLowerCase();
		if (!tags.has(normalized)) tags.set(normalized, tag);
	}
	return [...tags.values()].sort((left, right) => left.localeCompare(right));
}

export function filterPostsByTag(posts: PostSummary[], tag: string): PostSummary[] {
	if (!tag) return posts;
	const normalized = tag.toLocaleLowerCase();
	return posts.filter((post) => post.tags.some((candidate) => candidate.toLocaleLowerCase() === normalized));
}

export function parsePage(value: string | null): number {
	if (!value || !/^\d+$/.test(value)) return 1;
	return Math.max(1, Number.parseInt(value, 10));
}

export function paginatePosts(posts: PostSummary[], requestedPage: number, pageSize = BLOG_PAGE_SIZE) {
	const pageCount = Math.max(1, Math.ceil(posts.length / pageSize));
	const page = Math.min(Math.max(1, requestedPage), pageCount);
	const offset = (page - 1) * pageSize;
	return { posts: posts.slice(offset, offset + pageSize), page, pageCount, total: posts.length };
}
