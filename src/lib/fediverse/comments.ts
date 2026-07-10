import { parseDocument } from "htmlparser2";
import type { AnyNode, Element } from "domhandler";
import { isTag } from "domhandler";
import { z } from "zod";
import type { CommentsResult, FediverseAttachment, FediverseComment, RichTextNode } from "./types";

const accountSchema = z
	.object({
		display_name: z.string(),
		acct: z.string(),
		url: z.string(),
		avatar_static: z.string().optional(),
		avatar: z.string().optional(),
	})
	.passthrough();

const attachmentSchema = z
	.object({
		type: z.enum(["image", "gifv", "video", "audio", "unknown"]).catch("unknown"),
		url: z.string(),
		preview_url: z.string().nullable().optional(),
		description: z.string().nullable().optional(),
	})
	.passthrough();

const statusSchema = z
	.object({
		id: z.string(),
		in_reply_to_id: z.string().nullable().optional(),
		created_at: z.iso.datetime({ offset: true }),
		url: z.string().nullable().optional(),
		uri: z.string().optional(),
		content: z.string(),
		spoiler_text: z.string().default(""),
		sensitive: z.boolean().default(false),
		visibility: z.string().optional(),
		account: accountSchema,
		media_attachments: z.array(attachmentSchema).default([]),
	})
	.passthrough();

const contextSchema = z.object({ descendants: z.array(statusSchema) }).passthrough();
const SAFE_TAGS = new Set(["p", "strong", "b", "em", "i", "code", "blockquote", "ul", "ol", "li"]);
const DROPPED_TAGS = new Set(["script", "style", "iframe", "object", "embed", "form"]);

export function getFediverseContextUrl(source: string): string {
	const sourceUrl = new URL(source);
	if (sourceUrl.protocol !== "https:" || sourceUrl.username || sourceUrl.password)
		throw new Error("Invalid comments URL");

	const patterns = [/^\/@[^/]+\/([^/]+)\/?$/, /^\/users\/[^/]+\/statuses\/([^/]+)\/?$/, /^\/notice\/([^/]+)\/?$/];
	const match = patterns.map((pattern) => sourceUrl.pathname.match(pattern)).find(Boolean);
	if (!match) throw new Error("Unsupported Fediverse status URL");

	return new URL(`/api/v1/statuses/${encodeURIComponent(match[1])}/context`, sourceUrl.origin).href;
}

export async function fetchFediverseComments(
	source: string,
	fetcher: typeof fetch = fetch,
	signal?: AbortSignal,
): Promise<CommentsResult> {
	try {
		const response = await fetcher(getFediverseContextUrl(source), {
			headers: { accept: "application/json" },
			signal,
		});
		if (!response.ok) throw new Error(`Remote instance returned ${response.status}`);

		const context = contextSchema.parse(await response.json());
		return { state: "ready", comments: buildCommentTree(context.descendants), fetchedAt: new Date().toISOString() };
	} catch (error) {
		if (error instanceof Error && error.name === "AbortError") {
			return { state: "error", message: "The comments server took too long to respond." };
		}
		return { state: "error", message: "Comments are temporarily unavailable from the remote instance." };
	}
}

function buildCommentTree(statuses: z.infer<typeof statusSchema>[]): FediverseComment[] {
	const comments = statuses
		.filter((status) => status.visibility !== "private" && status.visibility !== "direct")
		.map(normalizeStatus)
		.sort((left, right) => Date.parse(left.createdAt) - Date.parse(right.createdAt));
	const byId = new Map(comments.map((comment) => [comment.id, comment]));
	const roots: FediverseComment[] = [];

	for (const comment of comments) {
		const parent = comment.inReplyToId ? byId.get(comment.inReplyToId) : undefined;
		if (parent) parent.replies.push(comment);
		else roots.push(comment);
	}

	return roots;
}

function normalizeStatus(status: z.infer<typeof statusSchema>): FediverseComment {
	const statusUrl = safeHttpsUrl(status.url ?? status.uri);
	const accountUrl = safeHttpsUrl(status.account.url);
	if (!statusUrl || !accountUrl) throw new Error("Remote comment contains an unsafe URL");

	const displayName = plainText(status.account.display_name).trim() || status.account.acct;
	return {
		id: status.id,
		inReplyToId: status.in_reply_to_id ?? undefined,
		url: statusUrl,
		createdAt: status.created_at,
		author: {
			name: displayName,
			acct: status.account.acct,
			url: accountUrl,
			avatar: safeHttpsUrl(status.account.avatar_static ?? status.account.avatar),
		},
		content: parseRichText(status.content),
		contentWarning: plainText(status.spoiler_text).trim() || undefined,
		sensitive: status.sensitive,
		attachments: status.media_attachments
			.map(normalizeAttachment)
			.filter((attachment): attachment is FediverseAttachment => attachment !== undefined),
		replies: [],
	};
}

function normalizeAttachment(attachment: z.infer<typeof attachmentSchema>): FediverseAttachment | undefined {
	const url = safeHttpsUrl(attachment.url);
	if (!url) return;
	return {
		type: attachment.type,
		url,
		previewUrl: safeHttpsUrl(attachment.preview_url ?? undefined),
		description: attachment.description?.trim() || undefined,
	};
}

function parseRichText(html: string): RichTextNode[] {
	const document = parseDocument(html, { decodeEntities: true });
	return document.children.flatMap(convertNode);
}

function convertNode(node: AnyNode): RichTextNode[] {
	if (node.type === "text") return node.data ? [{ type: "text", value: node.data }] : [];
	if (!isTag(node)) return [];

	const tag = node.name.toLowerCase();
	if (DROPPED_TAGS.has(tag)) return [];
	if (tag === "br") return [{ type: "break" }];
	if (tag === "img") return convertImage(node);

	const children = node.children.flatMap(convertNode);
	if (tag === "a") {
		const href = safeHttpsUrl(node.attribs.href);
		return href ? [{ type: "element", tag: "link", href, children }] : children;
	}
	if (!SAFE_TAGS.has(tag)) return children;

	const normalizedTag = tag === "b" ? "strong" : tag === "i" ? "em" : tag;
	return [{ type: "element", tag: normalizedTag, children } as RichTextNode];
}

function convertImage(node: Element): RichTextNode[] {
	const src = safeHttpsUrl(node.attribs.src);
	const alt = node.attribs.alt?.trim();
	if (!src || !alt || !node.attribs.class?.split(/\s+/).includes("emoji"))
		return alt ? [{ type: "text", value: alt }] : [];
	return [{ type: "emoji", src, alt }];
}

function plainText(html: string): string {
	const document = parseDocument(html, { decodeEntities: true });
	const collect = (node: AnyNode): string => {
		if (node.type === "text") return node.data;
		if (isTag(node) && !DROPPED_TAGS.has(node.name.toLowerCase())) return node.children.map(collect).join("");
		return "";
	};
	return document.children.map(collect).join("");
}

function safeHttpsUrl(value?: string): string | undefined {
	if (!value) return;
	try {
		const url = new URL(value);
		if (url.protocol !== "https:" || url.username || url.password) return;
		return url.href;
	} catch {
		return;
	}
}
