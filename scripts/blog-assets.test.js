import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getResponsiveWidths, prepareBlogAssets } from "./blog-assets.js";
import { rewritePostMarkdown } from "./blog-content-plugin.js";

const temporaryDirectories = [];

afterEach(async () => {
	vi.restoreAllMocks();
	await Promise.all(temporaryDirectories.splice(0).map((directory) => rm(directory, { recursive: true, force: true })));
});

async function fixtureRoot() {
	const root = await mkdtemp(path.join(os.tmpdir(), "cofob-blog-assets-"));
	temporaryDirectories.push(root);
	await Promise.all([
		mkdir(path.join(root, "src/lib/blog/posts"), { recursive: true }),
		mkdir(path.join(root, "static/blog/test-post"), { recursive: true }),
		mkdir(path.join(root, "static/stickers/test-pack"), { recursive: true }),
		mkdir(path.join(root, "static/static"), { recursive: true }),
	]);
	await writeFile(path.join(root, "static/robots.txt"), "User-agent: *\n");
	await writeFile(
		path.join(root, "src/lib/blog/posts/test-post.md"),
		`---
title: Optimized images
description: A fixture exercising the media pipeline.
published: 2026-01-01T10:00:00+00:00
updated: 2026-01-02T10:00:00+00:00
lang: en
draft: false
cover: hero.png
coverAlt: A red test image
---

<script>
  import TheGatesOfOrgrimmar005 from "@cofob/design-system-stickers/svelte/TheGatesOfOrgrimmar005";
</script>

![A red test image](hero.png)

[Download the guide](guide.pdf)

<Sticker
  src="/stickers/test-pack/sticker.png"
  alt="A shared sticker"
  sourceName="Test pack"
  sourceUrl="https://example.com/stickers"
/>

<AsciinemaPlayer src="session.cast" label="Terminal session" />

[Read another post](/blog/another-post/)
`,
	);
	await sharp({ create: { width: 1600, height: 900, channels: 4, background: "#dc2626" } })
		.png()
		.toFile(path.join(root, "static/blog/test-post/hero.png"));
	await writeFile(path.join(root, "static/blog/test-post/guide.pdf"), "%PDF-1.4 fixture");
	await writeFile(path.join(root, "static/blog/test-post/session.cast"), '{"version": 2}\n');
	await sharp({ create: { width: 128, height: 128, channels: 4, background: "#facc15" } })
		.png()
		.toFile(path.join(root, "static/stickers/test-pack/sticker.png"));
	return root;
}

describe("blog asset preparation", () => {
	it("generates responsive WebP files, social PNGs, attachments, and rewrites Markdown", async () => {
		const root = await fixtureRoot();
		const manifest = await prepareBlogAssets({ root, includePreviews: true });

		const hero = manifest.posts["test-post"].assets["blog/test-post/hero.png"];
		expect(hero.image.srcset).toContain("480w");
		expect(hero.image.srcset).toContain("960w");
		expect(hero.image.srcset).toContain("1440w");
		expect(hero.image).toMatchObject({ width: 1440, height: 810, type: "image/webp" });
		expect(hero.original).toBeUndefined();

		const guide = manifest.posts["test-post"].assets["blog/test-post/guide.pdf"];
		expect(guide.original.url).toMatch(/^\/blog\/test-post\/guide\.[a-f0-9]{12}\.pdf$/);
		await expect(readFile(path.join(root, ".blog-build/static", guide.original.url))).resolves.toBeTruthy();
		await expect(readFile(path.join(root, ".blog-build/static/blog/test-post/hero.png"))).rejects.toMatchObject({
			code: "ENOENT",
		});

		const sticker = manifest.posts["test-post"].assets["stickers/test-pack/sticker.png"];
		expect(sticker.image.src).toMatch(/^\/blog\/stickers\/test-pack\/sticker\.[a-f0-9]{12}\.128w\.webp$/);
		await expect(readFile(path.join(root, ".blog-build/static", sticker.image.src))).resolves.toBeTruthy();
		await expect(
			readFile(path.join(root, ".blog-build/static/stickers/the-gates-of-orgrimmar/005.3de660f58515.webp")),
		).resolves.toBeTruthy();
		await expect(
			readFile(path.join(root, ".blog-build/static/stickers/the-gates-of-orgrimmar/046.88c202cfb988.webp")),
		).rejects.toMatchObject({ code: "ENOENT" });

		const social = manifest.posts["test-post"].socialImage;
		expect(social).toMatchObject({ width: 1200, height: 630, type: "image/png" });
		const socialMetadata = await sharp(path.join(root, ".blog-build/static", social.src)).metadata();
		expect(socialMetadata).toMatchObject({ width: 1200, height: 630, format: "png" });

		const source = await readFile(path.join(root, "src/lib/blog/posts/test-post.md"), "utf8");
		const rewritten = rewritePostMarkdown(root, path.join(root, "src/lib/blog/posts/test-post.md"), source, manifest);
		expect(rewritten).toContain('srcset="');
		expect(rewritten).toContain("1440w");
		expect(rewritten).toContain(guide.original.url);
		expect(rewritten).toContain(sticker.image.src);
		expect(rewritten).toMatch(/src="\/blog\/test-post\/session\.[a-f0-9]{12}\.cast"/);
		expect(rewritten).toContain("[Read another post](/blog/another-post/)");
	});

	it("does not upscale small images", () => {
		expect(getResponsiveWidths(320)).toEqual([320]);
		expect(getResponsiveWidths(1000)).toEqual([480, 960, 1000]);
		expect(getResponsiveWidths(2000)).toEqual([480, 960, 1440]);
	});

	it("rejects remotely hosted post media", async () => {
		const root = await fixtureRoot();
		const postPath = path.join(root, "src/lib/blog/posts/test-post.md");
		const source = await readFile(postPath, "utf8");
		await writeFile(postPath, `${source}\n![Remote image](https://assets.example/image.png)\n`);
		await expect(prepareBlogAssets({ root, includePreviews: true })).rejects.toThrow(
			"must reference a local post asset",
		);
	});
});
