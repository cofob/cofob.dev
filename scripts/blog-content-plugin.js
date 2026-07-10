import { readFileSync, readdirSync, statSync } from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";

const CATALOG_ID = "virtual:blog-catalog";
const COMPONENTS_ID = "virtual:blog-components";
const RESOLVED_CATALOG_ID = `\0${CATALOG_ID}`;
const RESOLVED_COMPONENTS_ID = `\0${COMPONENTS_ID}`;
const SLUG_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const LANGUAGE_PATTERN = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
const MARKDOWN_IMAGE_PATTERN = /!\[([^\]]*)\]\(([^\s)]+)(?:\s+["'][^"']*["'])?\)/g;
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
		comments: z.url().optional(),
	})
	.strict()
	.superRefine((post, context) => {
		if (post.cover && !post.coverAlt) {
			context.addIssue({ code: "custom", path: ["coverAlt"], message: "coverAlt is required when cover is set" });
		}
		if (!post.cover && post.coverAlt) {
			context.addIssue({ code: "custom", path: ["cover"], message: "cover is required when coverAlt is set" });
		}
		if (post.updated && Date.parse(post.updated) < Date.parse(post.published)) {
			context.addIssue({ code: "custom", path: ["updated"], message: "updated must not be earlier than published" });
		}
	});

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

function assertStaticAsset(root, postSlug, assetUrl, label) {
	if (/^(?:https?:)?\/\//.test(assetUrl) || assetUrl.startsWith("data:")) return;

	const staticRoot = path.resolve(root, "static");
	const postAssetRoot = path.resolve(staticRoot, "blog", postSlug);
	const decoded = decodeURIComponent(assetUrl.split(/[?#]/, 1)[0]);
	const assetPath = decoded.startsWith("/")
		? path.resolve(staticRoot, `.${decoded}`)
		: path.resolve(postAssetRoot, decoded);

	if (!assetPath.startsWith(`${staticRoot}${path.sep}`)) throw new Error(`${label} must stay inside static/`);
	if (!statSafe(assetPath)) throw new Error(`${label} does not exist: ${path.relative(root, assetPath)}`);
}

function statSafe(filePath) {
	try {
		return statSync(filePath).isFile();
	} catch {
		return false;
	}
}

function validateMarkdownImages(root, slug, source) {
	const prose = source.replace(/^(?:```|~~~)[^\n]*\n[^]*?^(?:```|~~~)\s*$/gm, "");
	for (const match of prose.matchAll(MARKDOWN_IMAGE_PATTERN)) {
		const [, alt, url] = match;
		if (!alt.trim()) {
			throw new Error(`Markdown image ${url} needs meaningful alt text; use an explicit <img alt=""> for decoration`);
		}
		assertStaticAsset(root, slug, url.replace(/^<|>$/g, ""), `Markdown image ${url}`);
	}
}

function readPosts(root, buildTime, includePreviews) {
	const directory = path.resolve(root, "src/lib/blog/posts");
	const buildTimestamp = Date.parse(buildTime);

	return readdirSync(directory, { withFileTypes: true })
		.filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
		.map((entry) => {
			const slug = entry.name.slice(0, -3);
			if (!SLUG_PATTERN.test(slug)) throw new Error(`${entry.name}: post filename must be lower-kebab-case`);

			const source = readFileSync(path.join(directory, entry.name), "utf8");
			const parsed = matter(source);
			const result = postSchema.safeParse(parsed.data);
			if (!result.success) throw new Error(`${entry.name}: ${formatZodError(result.error)}`);

			const metadata = result.data;
			if (!isFediverseStatusUrl(metadata.comments)) {
				throw new Error(`${entry.name}: comments must be a Mastodon status or Pleroma /notice/ HTTPS URL`);
			}
			if (metadata.cover) assertStaticAsset(root, slug, metadata.cover, "cover");
			validateMarkdownImages(root, slug, parsed.content);

			const isPublic = !metadata.draft && Date.parse(metadata.published) <= buildTimestamp;
			return { slug, ...metadata, isPublic, modulePath: `/src/lib/blog/posts/${entry.name}` };
		})
		.filter((post) => includePreviews || post.isPublic)
		.sort((left, right) => Date.parse(right.published) - Date.parse(left.published));
}

function serializePost(post) {
	const serializable = Object.fromEntries(Object.entries(post).filter(([key]) => key !== "modulePath"));
	return JSON.stringify(serializable);
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
			const posts = readPosts(root, buildTime, includePreviews);

			if (id === RESOLVED_CATALOG_ID) {
				return `export const buildTime = ${JSON.stringify(buildTime)};\nexport const posts = [${posts
					.map(serializePost)
					.join(",")}];`;
			}

			const imports = posts.map((post, index) => `import Post${index} from ${JSON.stringify(post.modulePath)};`);
			const entries = posts.map((post, index) => `${JSON.stringify(post.slug)}: Post${index}`);
			return `${imports.join("\n")}\nexport const postComponents = {${entries.join(",")}};`;
		},
		handleHotUpdate(context) {
			const postsDirectory = path.resolve(root, "src/lib/blog/posts");
			const staticBlogDirectory = path.resolve(root, "static/blog");
			if (!context.file.startsWith(postsDirectory) && !context.file.startsWith(staticBlogDirectory)) return;

			for (const id of [RESOLVED_CATALOG_ID, RESOLVED_COMPONENTS_ID]) {
				const module = context.server.moduleGraph.getModuleById(id);
				if (module) context.server.moduleGraph.invalidateModule(module);
			}
			context.server.ws.send({ type: "full-reload" });
		},
	};
}
