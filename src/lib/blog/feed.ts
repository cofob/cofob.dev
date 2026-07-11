import { render } from "svelte/server";
import { buildTime, getPublicPosts } from "$lib/blog/catalog";
import { getPostComponent } from "$lib/blog/components";
import { createPortableBlogContext } from "$lib/blog/render-mode";
import { absoluteSiteUrl, getSiteOrigin } from "$lib/blog/url";
import type { PostSummary } from "$lib/blog/types";
import { escapeXml } from "$lib/blog/xml";
import { copyrightNotice, siteLicenseUrl } from "$lib/license";

export function renderRssFeed(): string {
	const posts = getPublicPosts();
	const items = posts.map((post) => renderRssItem(post)).join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/">
	<channel>
		<title>cofob.dev blog</title>
		<link>${escapeXml(absoluteSiteUrl("/blog/"))}</link>
		<description>Writing and notes from cofob.</description>
		<copyright>${escapeXml(copyrightNotice)}</copyright>
		<dc:rights>${escapeXml(copyrightNotice)} ${escapeXml(siteLicenseUrl)}</dc:rights>
		<language>en</language>
		<lastBuildDate>${new Date(latestUpdate(posts)).toUTCString()}</lastBuildDate>
		<atom:link href="${escapeXml(absoluteSiteUrl("/rss.xml"))}" rel="self" type="application/rss+xml" />
		${items}
	</channel>
</rss>`;
}

export function renderAtomFeed(): string {
	const posts = getPublicPosts();
	const entries = posts.map((post) => renderAtomEntry(post)).join("\n");

	return `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
	<title>cofob.dev blog</title>
	<subtitle>Writing and notes from cofob.</subtitle>
	<id>${escapeXml(absoluteSiteUrl("/blog/"))}</id>
	<link href="${escapeXml(absoluteSiteUrl("/blog/"))}" />
	<link href="${escapeXml(absoluteSiteUrl("/atom.xml"))}" rel="self" type="application/atom+xml" />
	<link href="${escapeXml(siteLicenseUrl)}" rel="license" />
	<rights>${escapeXml(copyrightNotice)}</rights>
	<updated>${new Date(latestUpdate(posts)).toISOString()}</updated>
	<author><name>cofob</name><uri>${escapeXml(getSiteOrigin().href)}</uri></author>
	${entries}
</feed>`;
}

function renderRssItem(post: PostSummary): string {
	const url = absoluteSiteUrl(`/blog/${post.slug}/`);
	return `<item>
		<title>${escapeXml(post.title)}</title>
		<link>${escapeXml(url)}</link>
		<guid isPermaLink="true">${escapeXml(url)}</guid>
		<description>${escapeXml(post.description)}</description>
		<pubDate>${new Date(post.published).toUTCString()}</pubDate>
		<dc:date>${new Date(post.updated ?? post.published).toISOString()}</dc:date>
		<dc:language>${escapeXml(post.lang)}</dc:language>
		<dc:rights>${escapeXml(copyrightNotice)} ${escapeXml(siteLicenseUrl)}</dc:rights>
		${post.tags.map((tag) => `<category>${escapeXml(tag)}</category>`).join("\n\t\t")}
		${renderRssMedia(post)}
		<content:encoded><![CDATA[${renderPostHtml(post).replaceAll("]]>", "]]]]><![CDATA[>")}]]></content:encoded>
	</item>`;
}

function renderAtomEntry(post: PostSummary): string {
	const url = absoluteSiteUrl(`/blog/${post.slug}/`);
	return `<entry>
		<title>${escapeXml(post.title)}</title>
		<id>${escapeXml(url)}</id>
		<link href="${escapeXml(url)}" />
		<published>${new Date(post.published).toISOString()}</published>
		<updated>${new Date(post.updated ?? post.published).toISOString()}</updated>
		<summary>${escapeXml(post.description)}</summary>
		<rights>${escapeXml(copyrightNotice)}</rights>
		<link href="${escapeXml(siteLicenseUrl)}" rel="license" />
		${post.tags.map((tag) => `<category term="${escapeXml(tag)}" />`).join("\n\t\t")}
		${renderAtomMedia(post)}
		<content type="html" xml:lang="${escapeXml(post.lang)}">${escapeXml(renderPostHtml(post))}</content>
	</entry>`;
}

function renderPostHtml(post: PostSummary): string {
	const component = getPostComponent(post.slug);
	if (!component) throw new Error(`Missing component for published post ${post.slug}`);

	const body = render(component, { context: createPortableBlogContext() }).body.replaceAll(/<!--[^]*?-->/g, "");
	const postUrl = absoluteSiteUrl(`/blog/${post.slug}/`);
	const content = absolutizeHtmlUrls(body, postUrl);
	const socialImage = renderContentSocialImage(post);
	const updated = post.updated
		? ` <span>Updated <time datetime="${escapeXml(post.updated)}">${escapeXml(post.updated.slice(0, 10))}</time>.</span>`
		: "";

	return `<article lang="${escapeXml(post.lang)}"><h1>${escapeXml(post.title)}</h1><p><time datetime="${escapeXml(
		post.published,
	)}">${escapeXml(post.published.slice(0, 10))}</time>.${updated}</p>${socialImage}${content}</article>`;
}

function renderContentSocialImage(post: PostSummary): string {
	if (!post.socialImage) return "";
	const image = post.socialImage;
	return `<img src="${escapeXml(absoluteSiteUrl(image.src))}" width="${image.width}" height="${image.height}" alt="${escapeXml(image.alt)}" loading="lazy" decoding="async">`;
}

function renderRssMedia(post: PostSummary): string {
	if (!post.socialImage) return "";
	const image = post.socialImage;
	return `<media:content url="${escapeXml(absoluteSiteUrl(image.src))}" type="${escapeXml(image.type)}" medium="image" width="${image.width}" height="${image.height}"><media:description type="plain">${escapeXml(image.alt)}</media:description></media:content>`;
}

function renderAtomMedia(post: PostSummary): string {
	if (!post.socialImage) return "";
	const image = post.socialImage;
	return `<link rel="enclosure" href="${escapeXml(absoluteSiteUrl(image.src))}" type="${escapeXml(image.type)}" />`;
}

export function absolutizeHtmlUrls(html: string, base: string): string {
	return html
		.replace(/\b(src|href|poster)="([^"]+)"/g, (match, attribute: string, value: string) => {
			if (value.startsWith("#") || /^(?:data|mailto|tel):/i.test(value)) return match;
			return `${attribute}="${escapeXml(new URL(value, base).href)}"`;
		})
		.replace(/\bsrcset="([^"]+)"/g, (_match, value: string) => {
			const candidates = value
				.split(",")
				.map((candidate) => candidate.trim())
				.map((candidate) => {
					const [url, descriptor] = candidate.split(/\s+/, 2);
					return `${new URL(url, base).href}${descriptor ? ` ${descriptor}` : ""}`;
				});
			return `srcset="${escapeXml(candidates.join(", "))}"`;
		});
}

function latestUpdate(posts: PostSummary[]): string {
	if (posts.length === 0) return buildTime;
	return posts
		.slice(1)
		.reduce(
			(latest, post) =>
				Date.parse(post.updated ?? post.published) > Date.parse(latest) ? (post.updated ?? post.published) : latest,
			posts[0].updated ?? posts[0].published,
		);
}
