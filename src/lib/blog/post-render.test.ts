import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import PostCard from "$lib/components/blog/PostCard.svelte";
import LatestPostLink from "$lib/components/blog/LatestPostLink.svelte";
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
			tags: ["testing"],
			draft: false,
			isPublic: true,
		};
		const output = render(PostCard, { props: { post } }).body;
		expect(output).toContain("Published");
		expect(output).toContain("Updated");
		expect(output).toContain('datetime="2026-02-02T10:00:00+00:00"');
	});

	it("renders the compact latest-post link", () => {
		const post: PostSummary = {
			slug: "compact-post",
			title: "A compact post",
			description: "A short description for the compact link.",
			published: "2026-01-01T10:00:00+00:00",
			lang: "en",
			tags: ["testing"],
			draft: false,
			isPublic: true,
		};
		const output = render(LatestPostLink, { props: { post } }).body;
		expect(output).toContain('href="/blog/compact-post"');
		expect(output).toContain("Latest post");
		expect(output).toContain("A compact post");
		expect(output).toContain(post.description);
		expect(output).toContain('datetime="2026-01-01T10:00:00+00:00"');
	});

	it("renders the codex-start chat excerpt as semantic server HTML", () => {
		const output = render(CodexStart).body;
		expect(output).toContain('<section class="chat ');
		expect(output).toContain('aria-label="Мои сообщения о первой версии pi-start"');
		expect(output).toContain('<p class="chat-author ');
		expect(output).toContain(">cofob</p>");
		expect(output).toContain('alt="Аватар cofob"');
		expect(output).toContain("вайб на баше");
		expect(output).toContain("https://site-assets.cofob.dev/codex-start/pi-start.cast");
		expect(output).toContain("https://site-assets.cofob.dev/codex-start/codex-start-demo.cast");
		expect(output).toContain('aria-label="Демонстрация codex-start в терминале"');
		expect(output).toContain("Открыть запись напрямую");
		expect(output).toContain('aria-label="Предупреждение"');
		expect(output).toContain("Это вайбкод");
		expect(output).toContain("https://t.me/addstickers/the_gates_of_orgrimmar");
		expect(output).toContain('alt="Стикер из пака The Gates of Orgrimmar"');
		expect(output).toContain("Источник:");
		expect(output).toContain('<aside class="notice ');
		expect(output).toContain('aria-label="Примечание"');
		expect(output).toContain('<figure class="sticker ');
		expect(output).toContain('alt="Стикер из пака The Gates of Orgrimmar в примечании"');
		expect(output).toContain('alt="Стикер из пака PhSilver"');
		expect(output).toContain("https://t.me/addstickers/PhSilver");
	});
});
