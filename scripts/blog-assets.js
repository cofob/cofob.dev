import { Resvg } from "@resvg/resvg-js";
import { createHash } from "node:crypto";
import { cp, mkdir, readFile, rm, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import path from "node:path";
import satori from "satori";
import sharp from "sharp";
import {
	MARKDOWN_IMAGE_PATTERN,
	MARKDOWN_LINK_PATTERN,
	isRemoteAsset,
	readSourcePosts,
	resolvePostAsset,
} from "./blog-content.js";

const IMAGE_EXTENSIONS = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".svg", ".webp"]);
const RASTER_EXTENSIONS = new Set([".avif", ".gif", ".jpeg", ".jpg", ".png", ".webp"]);
const VARIANT_WIDTHS = [480, 960, 1440];
const require = createRequire(import.meta.url);
const MANROPE_ROOT = path.dirname(require.resolve("manrope/package.json"));

const MIME_TYPES = new Map([
	[".avif", "image/avif"],
	[".cast", "application/x-asciicast"],
	[".css", "text/css; charset=utf-8"],
	[".gif", "image/gif"],
	[".html", "text/html; charset=utf-8"],
	[".jpeg", "image/jpeg"],
	[".jpg", "image/jpeg"],
	[".json", "application/json"],
	[".m4a", "audio/mp4"],
	[".mp3", "audio/mpeg"],
	[".mp4", "video/mp4"],
	[".ogg", "audio/ogg"],
	[".ogv", "video/ogg"],
	[".pdf", "application/pdf"],
	[".png", "image/png"],
	[".svg", "image/svg+xml"],
	[".txt", "text/plain; charset=utf-8"],
	[".webm", "video/webm"],
	[".webp", "image/webp"],
	[".woff", "font/woff"],
	[".woff2", "font/woff2"],
]);

export function getResponsiveWidths(sourceWidth) {
	const widths = VARIANT_WIDTHS.filter((width) => width < sourceWidth);
	widths.push(Math.min(sourceWidth, VARIANT_WIDTHS.at(-1)));
	return [...new Set(widths)].sort((left, right) => left - right);
}

function contentHash(buffer) {
	return createHash("sha256").update(buffer).digest("hex").slice(0, 12);
}

function stripCodeFences(source) {
	return source.replace(/^(?:```|~~~)[^\n]*\n[^]*?^(?:```|~~~)\s*$/gm, "");
}

function addReference(references, root, post, reference, role, required) {
	if (isRemoteAsset(reference)) return;
	const resolved = resolvePostAsset(root, post.slug, reference, { required });
	if (!resolved) return;
	const entry = references.get(resolved.sourceKey) ?? { ...resolved, roles: new Set() };
	entry.roles.add(role);
	references.set(resolved.sourceKey, entry);
}

function collectPostReferences(root, post) {
	const references = new Map();
	if (post.cover) addReference(references, root, post, post.cover, "display", true);
	if (post.socialImage) addReference(references, root, post, post.socialImage, "social", true);

	const prose = stripCodeFences(post.source);
	for (const match of prose.matchAll(MARKDOWN_IMAGE_PATTERN)) {
		addReference(references, root, post, match[2], "display", true);
	}
	for (const match of prose.matchAll(MARKDOWN_LINK_PATTERN)) {
		addReference(references, root, post, match[2], "original", false);
	}
	for (const match of prose.matchAll(
		/<(img|source|video|audio|Sticker|ChatThread|AsciinemaPlayer)\b[^>]*?\b(src|poster|avatar)=(['"])([^'"]+)\3[^>]*>/gi,
	)) {
		const [, tag, attribute, , reference] = match;
		if (isRemoteAsset(reference)) {
			throw new Error(`${post.slug}: ${tag} ${attribute} must reference a local post asset`);
		}
		const role =
			["img", "sticker"].includes(tag.toLowerCase()) || ["poster", "avatar"].includes(attribute.toLowerCase())
				? "display"
				: "original";
		addReference(references, root, post, reference, role, true);
	}
	for (const match of prose.matchAll(/<a\b[^>]*?\bhref=(['"])([^'"]+)\1[^>]*>/gi)) {
		addReference(references, root, post, match[2], "original", false);
	}

	return references;
}

function createArtifactWriter({ stageRoot, prefix }) {
	const artifacts = new Map();
	return {
		artifacts,
		async write(buffer, key, type) {
			const normalizedKey = key.split(path.sep).join("/");
			if (artifacts.has(normalizedKey)) return artifacts.get(normalizedKey).public;
			const publicUrl = `/${normalizedKey}`;
			const artifact = {
				key: normalizedKey,
				buffer,
				type,
				public: { url: publicUrl, type, size: buffer.byteLength },
			};
			artifacts.set(normalizedKey, artifact);
			const outputPath = path.join(stageRoot, ...normalizedKey.split("/"));
			await mkdir(path.dirname(outputPath), { recursive: true });
			await writeFile(outputPath, buffer);
			return artifact.public;
		},
		prefix,
	};
}

function outputKey(prefix, slug, sourceKey, marker, extension) {
	const postPrefix = `blog/${slug}/`;
	const isPostAsset = sourceKey.startsWith(postPrefix);
	const relative = isPostAsset ? sourceKey.slice(postPrefix.length) : sourceKey;
	const parsed = path.posix.parse(relative);
	const filename = `${parsed.name}.${marker}${extension}`;
	return path.posix.join(prefix, ...(isPostAsset ? [slug] : []), parsed.dir, filename);
}

async function createResponsiveImage(writer, slug, reference) {
	const extension = path.extname(reference.path).toLowerCase();
	if (!IMAGE_EXTENSIONS.has(extension)) {
		throw new Error(`${reference.sourceKey} is used as an image but has unsupported type ${extension || "(none)"}`);
	}

	if (extension === ".svg") {
		const buffer = await readFile(reference.path);
		const metadata = await sharp(buffer).metadata();
		const marker = contentHash(buffer);
		const emitted = await writer.write(
			buffer,
			outputKey(writer.prefix, slug, reference.sourceKey, marker, ".svg"),
			"image/svg+xml",
		);
		return {
			src: emitted.url,
			srcset: emitted.url,
			width: metadata.width ?? 0,
			height: metadata.height ?? 0,
			type: emitted.type,
		};
	}

	if (!RASTER_EXTENSIONS.has(extension)) throw new Error(`Cannot optimize ${reference.sourceKey}`);
	const input = await readFile(reference.path);
	const image = sharp(input, { animated: extension === ".gif" || extension === ".webp" }).rotate();
	const metadata = await image.metadata();
	if (!metadata.width || !metadata.height) throw new Error(`Could not read dimensions for ${reference.sourceKey}`);
	const sourceHeight = metadata.pageHeight ?? metadata.height;

	const variants = [];
	for (const width of getResponsiveWidths(metadata.width)) {
		const buffer = await sharp(input, { animated: extension === ".gif" || extension === ".webp" })
			.rotate()
			.resize({ width, withoutEnlargement: true })
			.webp({ quality: 82, effort: 4 })
			.toBuffer();
		const hash = contentHash(buffer);
		const emitted = await writer.write(
			buffer,
			outputKey(writer.prefix, slug, reference.sourceKey, `${hash}.${width}w`, ".webp"),
			"image/webp",
		);
		variants.push({ ...emitted, width, height: Math.round((sourceHeight * width) / metadata.width) });
	}
	const largest = variants.at(-1);
	return {
		src: largest.url,
		srcset: variants.map((variant) => `${variant.url} ${variant.width}w`).join(", "),
		width: largest.width,
		height: largest.height,
		type: "image/webp",
	};
}

async function emitOriginal(writer, slug, reference) {
	const buffer = await readFile(reference.path);
	const extension = path.extname(reference.path).toLowerCase();
	const hash = contentHash(buffer);
	return writer.write(
		buffer,
		outputKey(writer.prefix, slug, reference.sourceKey, hash, extension),
		MIME_TYPES.get(extension) ?? "application/octet-stream",
	);
}

async function coverDataUrl(root, post) {
	if (!post.cover) return;
	const resolved = resolvePostAsset(root, post.slug, post.cover);
	const buffer = await sharp(resolved.path, { animated: false })
		.rotate()
		.resize(500, 630, { fit: "cover" })
		.png({ compressionLevel: 9 })
		.toBuffer();
	return `data:image/png;base64,${buffer.toString("base64")}`;
}

async function renderSocialCard({ root, title, description, eyebrow, cover }) {
	void root;
	const [regularFont, boldFont] = await Promise.all([
		readFile(path.join(MANROPE_ROOT, "complete/manrope-regular.otf")),
		readFile(path.join(MANROPE_ROOT, "complete/manrope-bold.otf")),
	]);
	const hasCover = Boolean(cover);
	const titleSize = title.length > 72 ? 54 : title.length > 46 ? 64 : 76;
	const tree = {
		type: "div",
		props: {
			style: {
				width: "100%",
				height: "100%",
				display: "flex",
				background: "#f0f9ff",
				color: "#27272a",
				fontFamily: "Manrope",
			},
			children: [
				{
					type: "div",
					props: {
						style: {
							width: hasCover ? "700px" : "1200px",
							height: "630px",
							display: "flex",
							flexDirection: "column",
							justifyContent: "space-between",
							padding: "64px",
						},
						children: [
							{
								type: "div",
								props: {
									style: { display: "flex", flexDirection: "column", gap: "24px" },
									children: [
										{
											type: "div",
											props: {
												style: { color: "#0369a1", fontSize: "28px", fontWeight: 700 },
												children: eyebrow,
											},
										},
										{
											type: "div",
											props: {
												style: {
													display: "flex",
													fontSize: `${titleSize}px`,
													fontWeight: 700,
													lineHeight: 1.08,
													letterSpacing: "-2px",
												},
												children: title,
											},
										},
										{
											type: "div",
											props: {
												style: { color: "#52525b", display: "flex", fontSize: "28px", lineHeight: 1.35 },
												children: description,
											},
										},
									],
								},
							},
							{
								type: "div",
								props: {
									style: { display: "flex", fontSize: "30px", fontWeight: 700 },
									children: "cofob.dev",
								},
							},
						],
					},
				},
				hasCover
					? {
							type: "img",
							props: { src: cover, width: 500, height: 630, style: { objectFit: "cover" } },
						}
					: undefined,
			].filter(Boolean),
		},
	};
	const svg = await satori(tree, {
		width: 1200,
		height: 630,
		fonts: [
			{ name: "Manrope", data: regularFont, weight: 400, style: "normal" },
			{ name: "Manrope", data: boldFont, weight: 700, style: "normal" },
		],
	});
	return new Resvg(svg, { fitTo: { mode: "width", value: 1200 } }).render().asPng();
}

async function emitSocialImage(writer, root, post) {
	const alt = post.socialImageAlt ?? `${post.title} — cofob.dev`;
	let buffer;
	if (post.socialImage) {
		const resolved = resolvePostAsset(root, post.slug, post.socialImage);
		buffer = await sharp(resolved.path, { animated: false })
			.rotate()
			.resize(1200, 630, { fit: "cover", position: "attention" })
			.png({ compressionLevel: 9 })
			.toBuffer();
	} else {
		buffer = await renderSocialCard({
			root,
			title: post.title,
			description: post.description,
			eyebrow: "Blog post",
			cover: await coverDataUrl(root, post),
		});
	}
	const hash = contentHash(buffer);
	const emitted = await writer.write(
		buffer,
		path.posix.join(writer.prefix, post.slug, `social.${hash}.png`),
		"image/png",
	);
	return { src: emitted.url, width: 1200, height: 630, type: "image/png", alt };
}

async function emitSiteSocialImage(writer, root) {
	const buffer = await renderSocialCard({
		root,
		title: "cofob.dev",
		description: "Personal website and writing by Egor Ternovoi.",
		eyebrow: "Egor Ternovoi · cofob",
	});
	const hash = contentHash(buffer);
	const emitted = await writer.write(buffer, path.posix.join(writer.prefix, "social", `site.${hash}.png`), "image/png");
	return {
		src: emitted.url,
		width: 1200,
		height: 630,
		type: "image/png",
		alt: "cofob.dev — personal website of Egor Ternovoi",
	};
}

export async function prepareBlogAssets({ root = process.cwd(), includePreviews = false } = {}) {
	const prefix = "blog";
	const buildTime = new Date().toISOString();
	const buildRoot = path.resolve(root, ".blog-build");
	const stageRoot = path.join(buildRoot, "static");
	await rm(buildRoot, { recursive: true, force: true });
	await mkdir(stageRoot, { recursive: true });
	await cp(path.resolve(root, "static"), stageRoot, { recursive: true });
	await rm(path.join(stageRoot, "blog"), { recursive: true, force: true });
	await rm(path.join(stageRoot, "stickers"), { recursive: true, force: true });

	const writer = createArtifactWriter({ stageRoot, prefix });
	const posts = readSourcePosts(root, buildTime, includePreviews);
	const manifest = { version: 1, buildTime, prefix, posts: {}, siteSocialImage: undefined };

	manifest.siteSocialImage = await emitSiteSocialImage(writer, root);
	for (const post of posts) {
		const references = collectPostReferences(root, post);
		const assets = {};
		for (const reference of references.values()) {
			const entry = {};
			if (reference.roles.has("display")) entry.image = await createResponsiveImage(writer, post.slug, reference);
			if (reference.roles.has("original")) entry.original = await emitOriginal(writer, post.slug, reference);
			assets[reference.sourceKey] = entry;
		}
		manifest.posts[post.slug] = {
			assets,
			socialImage: await emitSocialImage(writer, root, post),
		};
	}

	await writeFile(path.join(buildRoot, "manifest.json"), `${JSON.stringify(manifest, undefined, 2)}\n`);
	console.log(`Prepared ${posts.length} blog post(s) with local assets`);
	return manifest;
}
