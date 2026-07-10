import { dev } from "$app/environment";
import { buildTime, posts, siteSocialImage } from "virtual:blog-catalog";
import type { PostMetadata, PostSummary } from "./types";

export { buildTime, siteSocialImage };

export function getPublicPosts(): PostSummary[] {
	return posts.filter((post) => post.isPublic).map(toSummary);
}

export function getPost(slug: string): PostMetadata | undefined {
	const post = posts.find((candidate) => candidate.slug === slug);
	if (!post || (!dev && !post.isPublic)) return;
	return post;
}

export function getPublicPostEntries(): Array<{ slug: string }> {
	return posts.filter((post) => post.isPublic).map(({ slug }) => ({ slug }));
}

function toSummary({ comments, ...summary }: PostMetadata): PostSummary {
	void comments;
	return summary;
}
