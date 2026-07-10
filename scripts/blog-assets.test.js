import { ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3";
import { mkdtemp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import sharp from "sharp";
import { afterEach, describe, expect, it, vi } from "vitest";
import { getResponsiveWidths, prepareBlogAssets, uploadArtifacts } from "./blog-assets.js";
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

![A red test image](hero.png)

[Download the guide](guide.pdf)

[Read another post](/blog/another-post/)
`,
	);
	await sharp({ create: { width: 1600, height: 900, channels: 4, background: "#dc2626" } })
		.png()
		.toFile(path.join(root, "static/blog/test-post/hero.png"));
	await writeFile(path.join(root, "static/blog/test-post/guide.pdf"), "%PDF-1.4 fixture");
	return root;
}

describe("blog asset preparation", () => {
	it("generates responsive WebP files, social PNGs, attachments, and rewrites Markdown", async () => {
		const root = await fixtureRoot();
		const manifest = await prepareBlogAssets({
			root,
			includePreviews: true,
			mode: "local",
			environment: { BLOG_ASSET_PREFIX: "media" },
		});

		const hero = manifest.posts["test-post"].assets["blog/test-post/hero.png"];
		expect(hero.image.srcset).toContain("480w");
		expect(hero.image.srcset).toContain("960w");
		expect(hero.image.srcset).toContain("1440w");
		expect(hero.image).toMatchObject({ width: 1440, height: 810, type: "image/webp" });
		expect(hero.original).toBeUndefined();

		const guide = manifest.posts["test-post"].assets["blog/test-post/guide.pdf"];
		expect(guide.original.url).toMatch(/^\/media\/test-post\/guide\.[a-f0-9]{12}\.pdf$/);
		await expect(readFile(path.join(root, ".blog-build/static", guide.original.url))).resolves.toBeTruthy();
		await expect(readFile(path.join(root, ".blog-build/static/blog/test-post/hero.png"))).rejects.toMatchObject({
			code: "ENOENT",
		});

		const social = manifest.posts["test-post"].socialImage;
		expect(social).toMatchObject({ width: 1200, height: 630, type: "image/png" });
		const socialMetadata = await sharp(path.join(root, ".blog-build/static", social.src)).metadata();
		expect(socialMetadata).toMatchObject({ width: 1200, height: 630, format: "png" });

		const source = await readFile(path.join(root, "src/lib/blog/posts/test-post.md"), "utf8");
		const rewritten = rewritePostMarkdown(root, path.join(root, "src/lib/blog/posts/test-post.md"), source, manifest);
		expect(rewritten).toContain('srcset="');
		expect(rewritten).toContain("1440w");
		expect(rewritten).toContain(guide.original.url);
		expect(rewritten).toContain("[Read another post](/blog/another-post/)");
	});

	it("does not upscale small images", () => {
		expect(getResponsiveWidths(320)).toEqual([320]);
		expect(getResponsiveWidths(1000)).toEqual([480, 960, 1000]);
		expect(getResponsiveWidths(2000)).toEqual([480, 960, 1440]);
	});

	it("fails external mode before building when credentials are missing", async () => {
		const root = await fixtureRoot();
		await expect(
			prepareBlogAssets({ root, mode: "external", environment: { BLOG_ASSET_MODE: "external" } }),
		).rejects.toThrow("BLOG_ASSET_S3_ENDPOINT");
	});

	it("uses public storage URLs and leaves media out of the Cloudflare static tree", async () => {
		const root = await fixtureRoot();
		const puts = [];
		const client = {
			async send(command) {
				if (command instanceof ListObjectsV2Command) return { Contents: [] };
				if (command instanceof PutObjectCommand) {
					puts.push(command.input);
					return {};
				}
				throw new Error(`Unexpected command ${command.constructor.name}`);
			},
		};
		vi.spyOn(console, "log").mockImplementation(() => {});
		const manifest = await prepareBlogAssets({
			root,
			includePreviews: true,
			mode: "external",
			client,
			environment: {
				BLOG_ASSET_S3_ENDPOINT: "https://account.r2.cloudflarestorage.com",
				BLOG_ASSET_S3_REGION: "auto",
				BLOG_ASSET_S3_BUCKET: "site-assets",
				BLOG_ASSET_S3_ACCESS_KEY_ID: "access-key",
				BLOG_ASSET_S3_SECRET_ACCESS_KEY: "secret-key",
				BLOG_ASSET_PUBLIC_BASE_URL: "https://site-assets.cofob.dev/",
				BLOG_ASSET_PREFIX: "blog",
			},
		});

		expect(manifest.posts["test-post"].socialImage.src).toMatch(
			/^https:\/\/site-assets\.cofob\.dev\/blog\/test-post\/social\.[a-f0-9]{12}\.png$/,
		);
		expect(manifest.posts["test-post"].assets["blog/test-post/hero.png"].image.src).toMatch(
			/^https:\/\/site-assets\.cofob\.dev\/blog\/test-post\/hero\./,
		);
		expect(puts.length).toBeGreaterThan(4);
		await expect(readFile(path.join(root, ".blog-build/static/blog"))).rejects.toMatchObject({ code: "ENOENT" });
	});
});

describe("S3 synchronization", () => {
	it("skips immutable keys, uploads missing objects, and only reports orphans", async () => {
		const sent = [];
		const client = {
			async send(command) {
				sent.push(command);
				if (command instanceof ListObjectsV2Command) {
					return { Contents: [{ Key: "blog/existing.webp" }, { Key: "blog/orphan.webp" }] };
				}
				if (command instanceof PutObjectCommand) return {};
				throw new Error(`Unexpected command ${command.constructor.name}`);
			},
		};
		const artifacts = new Map([
			["blog/existing.webp", { key: "blog/existing.webp", buffer: Buffer.from("old"), type: "image/webp" }],
			["blog/new.webp", { key: "blog/new.webp", buffer: Buffer.from("new"), type: "image/webp" }],
		]);
		vi.spyOn(console, "warn").mockImplementation(() => {});
		vi.spyOn(console, "log").mockImplementation(() => {});

		const result = await uploadArtifacts(artifacts, { bucket: "assets" }, "blog", client);
		const puts = sent.filter((command) => command instanceof PutObjectCommand);
		expect(puts).toHaveLength(1);
		expect(puts[0].input).toMatchObject({
			Bucket: "assets",
			Key: "blog/new.webp",
			ContentType: "image/webp",
			CacheControl: "public, max-age=31536000, immutable",
		});
		expect(result).toEqual({ uploaded: 1, orphaned: ["blog/orphan.webp"] });
		expect(sent.map((command) => command.constructor.name)).not.toContain("DeleteObjectCommand");
	});
});
