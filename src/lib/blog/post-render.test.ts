import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import PostCard from "$lib/components/blog/PostCard.svelte";
import LatestPostLink from "$lib/components/blog/LatestPostLink.svelte";
import CommentThread from "$lib/components/blog/CommentThread.svelte";
import { SearchResultCard } from "@cofob/design-system-svelte";
import { createPortableBlogContext } from "./render-mode";
import type { PostSummary } from "./types";
import CodexStart from "./posts/codex-start.md";
import ExamplePost, { metadata } from "./posts/example-post.md";
import FilamentSettings from "./posts/bambu-lab-p2s-filament-settings.md";

describe("MDsveX post rendering", () => {
	it("renders the draft template as semantic server HTML", () => {
		const output = render(ExamplePost).body;
		expect(metadata.title).toBe("Example blog post");
		expect(metadata.draft).toBe(true);
		expect(output).toContain("<h2>A section heading</h2>");
		expect(output).toContain('<pre tabindex="0" role="region" aria-label="Scrollable code example in ts"');
	});

	it("renders accessible Markdown tables without exposing Svelte directives as text", () => {
		const output = render(FilamentSettings).body;
		expect(output).toContain(
			'<div class="cf-table-container" tabindex="0" role="region" aria-label="Scrollable table"><table class="cf-table">',
		);
		expect(output).not.toContain("svelte-ignore a11y_no_noninteractive_tabindex");
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

	it("server-renders updated search results with highlighted tags", () => {
		const output = render(SearchResultCard, {
			props: {
				query: "design",
				result: {
					href: "/blog/design-system",
					title: "A design system",
					description: "Shared components",
					published: "1 July 2026",
					publishedAt: "2026-07-01T00:00:00Z",
					updated: "2 July 2026",
					updatedAt: "2026-07-02T00:00:00Z",
					tags: ["design systems"],
				},
			},
		}).body;

		expect(output).toContain('<time datetime="2026-07-01T00:00:00Z">1 July 2026</time>');
		expect(output).toContain('<time datetime="2026-07-02T00:00:00Z">2 July 2026</time>');
		expect(output).toContain('class="cf-tag"');
		expect(output).toContain("<mark>design</mark>");
		expect(output).toContain("systems");
	});

	it("server-renders comment avatars, emoji, and responsive media through DS contracts", () => {
		const output = render(CommentThread, {
			props: {
				lang: "en",
				comments: [
					{
						id: "comment",
						url: "https://social.example/@reader/comment",
						createdAt: "2026-07-10T12:00:00.000Z",
						author: {
							name: "Reader Name",
							acct: "reader@social.example",
							url: "https://social.example/@reader",
							avatar: "https://cdn.example/avatar.png",
						},
						content: [
							{ type: "text", value: "Hello " },
							{ type: "emoji", src: "https://cdn.example/wave.png", alt: ":wave:" },
						],
						sensitive: false,
						attachments: [
							{
								type: "image",
								url: "https://cdn.example/image.jpg",
								description: "A mountain at sunrise",
							},
						],
						replies: [],
					},
				],
			},
		}).body;

		expect(output).toContain('class="cf-avatar"');
		expect(output).toContain('referrerpolicy="no-referrer"');
		expect(output).toContain('class="cf-inline-emoji"');
		expect(output).toContain('class="cf-media-grid"');
		expect(output).toContain('alt="A mountain at sunrise"');
	});

	it("renders the codex-start chat excerpt as semantic server HTML", () => {
		const output = render(CodexStart).body;
		expect(output).toContain('<ol class="cf-chat-thread"');
		expect(output).toContain('aria-label="Мои сообщения о первой версии pi-start"');
		expect(output).toContain('<p class="cf-chat__author"><strong>cofob</strong>');
		expect(output).toContain('class="cf-chat__avatar"');
		expect(output).toContain('alt=""');
		expect(output).toContain("вайб на баше");
		expect(output).toContain(
			"/blog/play_asciinema/?url=https%3A%2F%2Fsite-assets.cofob.dev%2Fcodex-start%2Fpi-start.cast",
		);
		expect(output).toContain(
			"/blog/play_asciinema/?url=https%3A%2F%2Fsite-assets.cofob.dev%2Fcodex-start%2Fcodex-start-demo.cast",
		);
		expect(output).toContain('aria-label="Демонстрация codex-start в терминале"');
		expect(output).toContain("Открыть запись в плеере");
		expect(output).not.toContain("Загрузка плеера");
		expect(output).toContain('aria-label="Предупреждение"');
		expect(output).toContain("Это вайбкод");
		expect(output).toContain("https://t.me/addstickers/the_gates_of_orgrimmar");
		expect(output).toContain('alt="Стикер из пака The Gates of Orgrimmar"');
		expect(output).toContain("Источник:");
		expect(output).toContain('class="cf-alert" data-tone="info"');
		expect(output).toContain('aria-label="Примечание"');
		expect(output).toContain('class="cf-sticker"');
		expect(output).toContain('alt="Стикер из пака The Gates of Orgrimmar в примечании"');
		expect(output).toContain('alt="Стикер из пака PhSilver"');
		expect(output).toContain("https://t.me/addstickers/PhSilver");
	});

	it("renders complex post components as portable HTML when requested", () => {
		const output = render(CodexStart, { context: createPortableBlogContext() }).body.replaceAll(/<!--[^]*?-->/g, "");
		expect(output).toContain("<blockquote");
		expect(output).toMatch(/<strong[^>]*>Warning!<\/strong>/);
		expect(output).toMatch(/<strong[^>]*>Note:<\/strong>/);
		expect(output).toMatch(/<strong[^>]*>@cofob wrote:<\/strong>/);
		expect(output).toMatch(/вайб на баше<br[^>]*>ужасный\)<br[^>]*>но работает/);
		expect(output).toContain("https://gist.github.com/cofob/4c9a7e2fdd71410fae65005633378a5c");
		expect(output).not.toContain("chat-avatar");
		expect(output).not.toContain('class="recording');
		expect(output).not.toContain("Загрузка плеера");
		expect(output).toContain(
			'href="/blog/play_asciinema/?url=https%3A%2F%2Fsite-assets.cofob.dev%2Fcodex-start%2Fcodex-start-demo.cast"',
		);
		expect(output).toContain('alt="Стикер из пака The Gates of Orgrimmar"');
		expect(output).toContain("https://t.me/addstickers/the_gates_of_orgrimmar");
	});
});
