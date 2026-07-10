import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

export const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
export const MARKDOWN_IMAGE_PATTERN = /!\[([^\]]*)\]\((<[^>]+>|[^\s)]+)(?:\s+["'][^"']*["'])?\)/g;
export const MARKDOWN_LINK_PATTERN = /(?<!!)\[([^\]]+)\]\((<[^>]+>|[^\s)]+)(?:\s+["'][^"']*["'])?\)/g;

const LANGUAGE_PATTERN = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
const dateTimeSchema = z.preprocess(
	(value) => (value instanceof Date ? value.toISOString() : value),
	z.iso.datetime({ offset: true }),
);

const postSchema = z
	.object({
		title: z.string().trim().min(1),
		description: z.string().trim().min(1),
		published: dateTimeSchema,
		updated: dateTimeSchema.optional(),
		lang: z.string().regex(LANGUAGE_PATTERN).default("en"),
		draft: z.boolean(),
		cover: z.string().trim().min(1).optional(),
		coverAlt: z.string().trim().min(1).optional(),
		socialImage: z.string().trim().min(1).optional(),
		socialImageAlt: z.string().trim().min(1).optional(),
		comments: z.url().optional(),
	})
	.strict()
	.superRefine((post, context) => {
		validatePair(post, context, "cover", "coverAlt");
		validatePair(post, context, "socialImage", "socialImageAlt");
		if (post.socialImage && isRemoteAsset(post.socialImage) && !post.socialImage.startsWith("https://")) {
			context.addIssue({
				code: "custom",
				path: ["socialImage"],
				message: "remote socialImage must use an absolute HTTPS URL",
			});
		}
		if (post.updated && Date.parse(post.updated) < Date.parse(post.published)) {
			context.addIssue({ code: "custom", path: ["updated"], message: "updated must not be earlier than published" });
		}
	});

function validatePair(post, context, valueKey, altKey) {
	if (post[valueKey] && !post[altKey]) {
		context.addIssue({ code: "custom", path: [altKey], message: `${altKey} is required when ${valueKey} is set` });
	}
	if (!post[valueKey] && post[altKey]) {
		context.addIssue({ code: "custom", path: [valueKey], message: `${valueKey} is required when ${altKey} is set` });
	}
}

export function isRemoteAsset(value) {
	return /^(?:https?:)?\/\//i.test(value) || /^(?:data|mailto|tel):/i.test(value) || value.startsWith("#");
}

export function splitAssetReference(value) {
	const normalized = value.replace(/^<|>$/g, "");
	const separator = normalized.search(/[?#]/);
	return separator === -1
		? { pathname: normalized, suffix: "" }
		: { pathname: normalized.slice(0, separator), suffix: normalized.slice(separator) };
}

export function resolvePostAsset(root, slug, assetUrl, { required = true } = {}) {
	if (isRemoteAsset(assetUrl)) return;

	const staticRoot = path.resolve(root, "static");
	const postAssetRoot = path.resolve(staticRoot, "blog", slug);
	const { pathname, suffix } = splitAssetReference(assetUrl);
	let decoded;
	try {
		decoded = decodeURIComponent(pathname);
	} catch {
		throw new Error(`Invalid percent encoding in asset URL ${assetUrl}`);
	}
	const assetPath = decoded.startsWith("/")
		? path.resolve(staticRoot, `.${decoded}`)
		: path.resolve(postAssetRoot, decoded);

	if (assetPath !== postAssetRoot && !assetPath.startsWith(`${postAssetRoot}${path.sep}`)) {
		if (!required) return;
		throw new Error(`Blog asset ${assetUrl} must stay inside static/blog/${slug}/`);
	}
	if (!statSafe(assetPath)) {
		if (!required) return;
		throw new Error(`Blog asset does not exist: ${path.relative(root, assetPath)}`);
	}

	return {
		path: assetPath,
		sourceKey: path.relative(staticRoot, assetPath).split(path.sep).join("/"),
		suffix,
	};
}

function statSafe(filePath) {
	try {
		return statSync(filePath).isFile();
	} catch {
		return false;
	}
}

function isFediverseStatusUrl(value) {
	if (!value) return true;

	try {
		const url = new URL(value);
		if (url.protocol !== "https:" || url.username || url.password || (url.port && url.port !== "443")) return false;
		return (
			/^\/@[^/]+\/[^/]+\/?$/.test(url.pathname) ||
			/^\/users\/[^/]+\/statuses\/[^/]+\/?$/.test(url.pathname) ||
			/^\/notice\/[^/]+\/?$/.test(url.pathname)
		);
	} catch {
		return false;
	}
}

function formatZodError(error) {
	return error.issues.map((issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`).join("; ");
}

function validateMarkdownImages(root, slug, source) {
	const prose = source.replace(/^(?:```|~~~)[^\n]*\n[^]*?^(?:```|~~~)\s*$/gm, "");
	for (const match of prose.matchAll(MARKDOWN_IMAGE_PATTERN)) {
		const [, alt, url] = match;
		if (!alt.trim()) {
			throw new Error(`Markdown image ${url} needs meaningful alt text; use an explicit <img alt=""> for decoration`);
		}
		resolvePostAsset(root, slug, url);
	}
}

export function readSourcePosts(root, buildTime, includePreviews) {
	const directory = path.resolve(root, "src/lib/blog/posts");
	const buildTimestamp = Date.parse(buildTime);

	return readdirSync(directory, { withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
		.map((entry) => {
			const slug = entry.name.slice(0, -3);
			if (!SLUG_PATTERN.test(slug)) throw new Error(`${entry.name}: post filename must be lower-kebab-case`);

			const modulePath = path.join(directory, entry.name);
			const source = readFileSync(modulePath, "utf8");
			const parsed = matter(source);
			const result = postSchema.safeParse(parsed.data);
			if (!result.success) throw new Error(`${entry.name}: ${formatZodError(result.error)}`);

			const metadata = result.data;
			if (!isFediverseStatusUrl(metadata.comments)) {
				throw new Error(`${entry.name}: comments must be a Mastodon status or Pleroma /notice/ HTTPS URL`);
			}
			if (metadata.cover) resolvePostAsset(root, slug, metadata.cover);
			if (metadata.socialImage) resolvePostAsset(root, slug, metadata.socialImage);
			validateMarkdownImages(root, slug, parsed.content);

			const isPublic = !metadata.draft && Date.parse(metadata.published) <= buildTimestamp;
			return {
				slug,
				...metadata,
				isPublic,
				modulePath: `/src/lib/blog/posts/${entry.name}`,
				source: parsed.content,
			};
		})
		.filter((post) => includePreviews || post.isPublic)
		.sort((left, right) => Date.parse(right.published) - Date.parse(left.published));
}
