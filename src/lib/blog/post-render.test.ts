import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import PostCard from "$lib/components/blog/PostCard.svelte";
import type { PostSummary } from "./types";
import CodexStart from "./posts/codex-start.md";
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

	it("renders the codex-start chat excerpt as semantic server HTML", () => {
		const output = render(CodexStart).body;
		expect(output).toContain('<section class="chat ');
		expect(output).toContain('aria-label="Мои сообщения о первой версии pi-start"');
		expect(output).toContain('<p class="chat-author">cofob</p>');
		expect(output).toContain('alt="Аватар cofob"');
		expect(output).toContain("вайб на баше");
		expect(output).toContain("https://site-assets.cofob.dev/codex-start/pi-start.cast");
		expect(output).toContain("Открыть запись напрямую");
	});
});
