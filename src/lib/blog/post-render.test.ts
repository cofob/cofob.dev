import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import PostCard from "$lib/components/blog/PostCard.svelte";
import type { PostSummary } from "./types";
import ExamplePost, { metadata } from "./posts/example-post.md";

describe("MDsveX post rendering", () => {
	it("renders the draft template as semantic server HTML", () => {
		const output = render(ExamplePost).body;
		expect(metadata.title).toBe("Example blog post");
		expect(metadata.draft).toBe(true);
		expect(output).toContain("<h2>A section heading</h2>");
		expect(output).toContain('<pre tabindex="0" role="region" aria-label="Scrollable code example in ts"');
	});

	it("renders published and updated dates without changing the post model", () => {
		const post: PostSummary = {
			slug: "updated-post",
			title: "Updated post",
			description: "A post with a later modification date.",
			published: "2026-01-01T10:00:00+00:00",
			updated: "2026-02-02T10:00:00+00:00",
			lang: "en",
			draft: false,
			isPublic: true,
		};
		const output = render(PostCard, { props: { post } }).body;
		expect(output).toContain("Published");
		expect(output).toContain("Updated");
		expect(output).toContain('datetime="2026-02-02T10:00:00+00:00"');
	});
});
