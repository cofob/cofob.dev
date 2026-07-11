import { describe, expect, it } from "vitest";
import type { PostSummary } from "./types";
import { collectTags, filterPostsByTag, paginatePosts, parsePage } from "./list";

function post(slug: string, tags: string[]): PostSummary {
	return {
		slug,
		title: slug,
		description: slug,
		published: "2026-01-01T00:00:00+00:00",
		lang: "en",
		tags,
		draft: false,
		isPublic: true,
	};
}

describe("blog listing", () => {
	const posts = [post("one", ["Codex", "Docker"]), post("two", ["docker", "Rust"])];

	it("collects sorted display tags and filters case-insensitively", () => {
		expect(collectTags(posts)).toEqual(["Codex", "Docker", "Rust"]);
		expect(filterPostsByTag(posts, "DOCKER").map(({ slug }) => slug)).toEqual(["one", "two"]);
	});

	it("accepts positive integer pages and defaults invalid values", () => {
		expect(parsePage("3")).toBe(3);
		expect(parsePage("0")).toBe(1);
		expect(parsePage("1.5")).toBe(1);
		expect(parsePage("nope")).toBe(1);
		expect(parsePage(null)).toBe(1);
	});

	it("paginates and clamps pages beyond the available results", () => {
		const manyPosts = Array.from({ length: 23 }, (_, index) => post(String(index + 1), []));
		expect(paginatePosts(manyPosts, 2)).toMatchObject({ page: 2, pageCount: 3, total: 23 });
		expect(paginatePosts(manyPosts, 2).posts).toHaveLength(10);
		expect(paginatePosts(manyPosts, 99)).toMatchObject({ page: 3, pageCount: 3, total: 23 });
		expect(paginatePosts(manyPosts, 99).posts).toHaveLength(3);
	});
});
