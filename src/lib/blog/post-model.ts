import type { PostModel } from "@cofob/design-system-svelte";
import { formatPostDate } from "./format";
import type { PostSummary } from "./types";

export type PostModelSource = Pick<
	PostSummary,
	"slug" | "title" | "description" | "published" | "updated" | "lang" | "tags"
> &
	Partial<Pick<PostSummary, "cover">>;

export function toPostModel(post: PostModelSource, href: string): PostModel {
	return {
		slug: post.slug,
		href,
		title: post.title,
		description: post.description,
		published: formatPostDate(post.published, post.lang),
		publishedAt: post.published,
		updated: post.updated ? formatPostDate(post.updated, post.lang) : undefined,
		updatedAt: post.updated,
		lang: post.lang,
		tags: post.tags,
		cover: post.cover
			? {
					src: post.cover.src,
					alt: post.cover.alt,
					srcset: post.cover.srcset,
					sizes: "(min-width: 640px) 320px, calc(100vw - 2rem)",
					width: post.cover.width,
					height: post.cover.height,
				}
			: undefined,
	};
}
