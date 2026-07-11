import { getContext } from "svelte";

export type BlogRenderMode = "browser" | "portable";

export const BLOG_RENDER_MODE = Symbol("cofob.blog-render-mode");

export function getBlogRenderMode(): BlogRenderMode {
	return getContext<BlogRenderMode | undefined>(BLOG_RENDER_MODE) ?? "browser";
}

export function createPortableBlogContext(): Map<unknown, unknown> {
	return new Map([[BLOG_RENDER_MODE, "portable" satisfies BlogRenderMode]]);
}
