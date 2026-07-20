import { readFileSync } from "node:fs";
import path from "node:path";
import {
	MARKDOWN_IMAGE_PATTERN,
	MARKDOWN_LINK_PATTERN,
	isRemoteAsset,
	readSourcePosts,
	resolvePostAsset,
} from "./blog-content.js";

const CATALOG_ID = "virtual:blog-catalog";
const COMPONENTS_ID = "virtual:blog-components";
const RESOLVED_CATALOG_ID = `\0${CATALOG_ID}`;
const RESOLVED_COMPONENTS_ID = `\0${COMPONENTS_ID}`;

function readManifest(root) {
	if (process.env.BLOG_ASSETS_PREPARED !== "1") return;
	try {
		return JSON.parse(readFileSync(path.resolve(root, ".blog-build/manifest.json"), "utf8"));
	} catch (error) {
		throw new Error(`Blog assets were marked as prepared, but the manifest could not be read: ${error.message}`, {
			cause: error,
		});
	}
}

function basicImage(source, alt) {
	return { src: source, srcset: source, width: 0, height: 0, type: inferImageType(source), alt };
}

function inferImageType(source) {
	try {
		const extension = path.extname(new URL(source, "https://cofob.dev").pathname).toLowerCase();
		return (
			{
				".avif": "image/avif",
				".gif": "image/gif",
				".jpeg": "image/jpeg",
				".jpg": "image/jpeg",
				".png": "image/png",
				".svg": "image/svg+xml",
				".webp": "image/webp",
			}[extension] ?? "image/*"
		);
	} catch {
		return "image/*";
	}
}

function getManifestAsset(root, slug, reference, manifest) {
	if (!manifest || isRemoteAsset(reference)) return;
	const resolved = resolvePostAsset(root, slug, reference);
	return manifest.posts?.[slug]?.assets?.[resolved.sourceKey];
}

function resolvePost(root, post, manifest) {
	const { modulePath, source, cover, coverAlt, socialImage, socialImageAlt, ...metadata } = post;
	void source;
	const coverAsset = cover
		? isRemoteAsset(cover) || !manifest
			? basicImage(cover, coverAlt)
			: getManifestAsset(root, post.slug, cover, manifest)?.image
		: undefined;
	if (cover && !coverAsset) throw new Error(`${post.slug}: prepared cover is missing from the asset manifest`);

	const generatedSocial = manifest?.posts?.[post.slug]?.socialImage;
	const resolvedSocial =
		socialImage && isRemoteAsset(socialImage)
			? { src: socialImage, width: 1200, height: 630, type: inferImageType(socialImage), alt: socialImageAlt }
			: generatedSocial;
	if (manifest && !resolvedSocial)
		throw new Error(`${post.slug}: prepared social image is missing from the asset manifest`);

	return {
		...metadata,
		slug: post.slug,
		cover: coverAsset,
		socialImage: resolvedSocial,
		comments: post.comments,
		isPublic: post.isPublic,
		modulePath,
	};
}

function serializePost(post) {
	const serializable = Object.fromEntries(Object.entries(post).filter(([key]) => key !== "modulePath"));
	return JSON.stringify(serializable);
}

function escapeAttribute(value) {
	return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function responsiveImageMarkup(asset, alt) {
	const dimensions = asset.width > 0 ? ` width="${asset.width}" height="${asset.height}"` : "";
	return `<figure class="cf-responsive-image"><span class="cf-responsive-image__media"><img class="cf-responsive-image__light" src="${escapeAttribute(asset.src)}" srcset="${escapeAttribute(asset.srcset)}" sizes="(min-width: 800px) 768px, calc(100vw - 2rem)"${dimensions} alt="${escapeAttribute(alt)}" loading="lazy" decoding="async"></span></figure>`;
}

export function rewritePostMarkdown(root, id, source, manifest) {
	if (!manifest) return source;
	const slug = path.basename(id, ".md");
	const postAssets = manifest.posts?.[slug]?.assets;
	if (!postAssets) return source;

	return rewriteOutsideCodeFences(source, (segment) => {
		let rewritten = segment.replace(
			/<(img|source|video|audio|Sticker|ChatThread)\b([^>]*?)\b(src|poster|avatar)=(['"])([^'"]+)\4([^>]*)>/gi,
			(original, tag, before, attribute, quote, reference, after) => {
				if (isRemoteAsset(reference)) return original;
				const resolved = resolvePostAsset(root, slug, reference, { required: false });
				if (!resolved) return original;
				const entry = postAssets[resolved.sourceKey];
				const url =
					["img", "sticker"].includes(tag.toLowerCase()) || ["poster", "avatar"].includes(attribute.toLowerCase())
						? entry?.image?.src
						: entry?.original?.url;
				if (!url) return original;
				return `<${tag}${before}${attribute}=${quote}${escapeAttribute(url + resolved.suffix)}${quote}${after}>`;
			},
		);

		rewritten = rewritten.replace(MARKDOWN_IMAGE_PATTERN, (original, alt, reference) => {
			if (isRemoteAsset(reference)) return original;
			const resolved = resolvePostAsset(root, slug, reference);
			const asset = postAssets[resolved.sourceKey]?.image;
			if (!asset) throw new Error(`${slug}: optimized image is missing for ${reference}`);
			return responsiveImageMarkup(asset, alt);
		});

		return rewritten.replace(MARKDOWN_LINK_PATTERN, (original, label, reference) => {
			if (isRemoteAsset(reference)) return original;
			const resolved = resolvePostAsset(root, slug, reference, { required: false });
			if (!resolved) return original;
			const asset = postAssets[resolved.sourceKey];
			if (!asset?.original) return original;
			return `[${label}](${asset.original.url}${resolved.suffix})`;
		});
	});
}

function rewriteOutsideCodeFences(source, rewrite) {
	let fence;
	let prose = "";
	let result = "";
	const flush = () => {
		result += rewrite(prose);
		prose = "";
	};

	for (const line of source.split(/(?<=\n)/)) {
		const marker = line.match(/^\s*(`{3,}|~{3,})/u)?.[1];
		if (!fence && marker) {
			flush();
			fence = marker[0];
			result += line;
		} else if (fence) {
			result += line;
			if (marker?.[0] === fence) fence = undefined;
		} else {
			prose += line;
		}
	}
	flush();
	return result;
}

export function blogContentPlugin({ buildTime }) {
	let root = process.cwd();
	let includePreviews = false;

	return {
		name: "cofob-blog-content",
		enforce: "pre",
		configResolved(config) {
			root = config.root;
			includePreviews = config.command === "serve";
		},
		resolveId(id) {
			if (id === CATALOG_ID) return RESOLVED_CATALOG_ID;
			if (id === COMPONENTS_ID) return RESOLVED_COMPONENTS_ID;
		},
		load(id) {
			if (id !== RESOLVED_CATALOG_ID && id !== RESOLVED_COMPONENTS_ID) return;
			const manifest = readManifest(root);
			const effectiveBuildTime = manifest?.buildTime ?? buildTime;
			const posts = readSourcePosts(root, effectiveBuildTime, includePreviews).map((post) =>
				resolvePost(root, post, manifest),
			);

			if (id === RESOLVED_CATALOG_ID) {
				return `export const buildTime = ${JSON.stringify(effectiveBuildTime)};\nexport const siteSocialImage = ${JSON.stringify(
					manifest?.siteSocialImage,
				)};\nexport const posts = [${posts.map(serializePost).join(",")}];`;
			}

			const imports = posts.map((post, index) => `import Post${index} from ${JSON.stringify(post.modulePath)};`);
			const entries = posts.map((post, index) => `${JSON.stringify(post.slug)}: Post${index}`);
			return `${imports.join("\n")}\nexport const postComponents = {${entries.join(",")}};`;
		},
		transform(source, id) {
			if (!id.startsWith(path.resolve(root, "src/lib/blog/posts")) || !id.endsWith(".md")) return;
			return { code: rewritePostMarkdown(root, id, source, readManifest(root)), map: null };
		},
		async handleHotUpdate(context) {
			const postsDirectory = path.resolve(root, "src/lib/blog/posts");
			const staticBlogDirectory = path.resolve(root, "static/blog");
			if (!context.file.startsWith(postsDirectory) && !context.file.startsWith(staticBlogDirectory)) return;

			if (process.env.BLOG_ASSETS_PREPARED === "1") {
				const { prepareBlogAssets } = await import("./blog-assets.js");
				await prepareBlogAssets({ root, includePreviews: true, mode: "local" });
			}

			for (const id of [RESOLVED_CATALOG_ID, RESOLVED_COMPONENTS_ID]) {
				const module = context.server.moduleGraph.getModuleById(id);
				if (module) context.server.moduleGraph.invalidateModule(module);
			}
			context.server.ws.send({ type: "full-reload" });
		},
	};
}
