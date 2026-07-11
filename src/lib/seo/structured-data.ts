import { absoluteSiteUrl } from "$lib/blog/url";
import type { PostMetadata, PostSummary, SocialImageAsset } from "$lib/blog/types";

export type JsonLdDocument = Record<string, unknown>;

const PERSON_ID = absoluteSiteUrl("/#person");
const WEBSITE_ID = absoluteSiteUrl("/#website");
const BLOG_ID = absoluteSiteUrl("/blog/#blog");

function personEntity() {
	return {
		"@type": "Person",
		"@id": PERSON_ID,
		name: "Egor Ternovoi",
		alternateName: "cofob",
		url: absoluteSiteUrl("/"),
		sameAs: ["https://github.com/cofob/"],
	};
}

function websiteEntity(image?: SocialImageAsset) {
	return {
		"@type": "WebSite",
		"@id": WEBSITE_ID,
		url: absoluteSiteUrl("/"),
		name: "cofob.dev",
		description: "Personal website, portfolio, and writing by Egor Ternovoi.",
		inLanguage: "en",
		publisher: { "@id": PERSON_ID },
		...(image ? { image: absoluteAssetUrl(image.src) } : {}),
	};
}

function blogEntity(posts: PostSummary[]) {
	return {
		"@type": "Blog",
		"@id": BLOG_ID,
		url: absoluteSiteUrl("/blog/"),
		name: "cofob.dev blog",
		description: "Writing and notes from cofob.",
		inLanguage: "en",
		publisher: { "@id": PERSON_ID },
		isPartOf: { "@id": WEBSITE_ID },
		blogPost: posts.map((post) => ({ "@id": articleId(post.slug) })),
	};
}

function articleId(slug: string) {
	return absoluteSiteUrl(`/blog/${slug}/#article`);
}

function absoluteAssetUrl(value: string) {
	return value.startsWith("http://") || value.startsWith("https://") ? value : absoluteSiteUrl(value);
}

export function homeStructuredData(image?: SocialImageAsset): JsonLdDocument {
	return {
		"@context": "https://schema.org",
		"@graph": [personEntity(), websiteEntity(image)],
	};
}

export function blogStructuredData(posts: PostSummary[], image?: SocialImageAsset): JsonLdDocument {
	return {
		"@context": "https://schema.org",
		"@graph": [personEntity(), websiteEntity(image), blogEntity(posts)],
	};
}

export function postStructuredData(post: PostMetadata, image?: SocialImageAsset): JsonLdDocument {
	const pageUrl = absoluteSiteUrl(`/blog/${post.slug}/`);
	const socialImage = post.socialImage ?? image;
	const { comments, ...summary }: PostMetadata = post;
	void comments;
	return {
		"@context": "https://schema.org",
		"@graph": [
			personEntity(),
			websiteEntity(image),
			blogEntity([summary]),
			{
				"@type": "BlogPosting",
				"@id": articleId(post.slug),
				url: pageUrl,
				headline: post.title,
				description: post.description,
				keywords: post.tags,
				inLanguage: post.lang,
				datePublished: post.published,
				dateModified: post.updated ?? post.published,
				mainEntityOfPage: pageUrl,
				isPartOf: { "@id": BLOG_ID },
				author: { "@id": PERSON_ID },
				publisher: { "@id": PERSON_ID },
				...(socialImage ? { image: absoluteAssetUrl(socialImage.src) } : {}),
			},
			{
				"@type": "BreadcrumbList",
				"@id": `${pageUrl}#breadcrumb`,
				itemListElement: [
					{ "@type": "ListItem", position: 1, name: "Home", item: absoluteSiteUrl("/") },
					{ "@type": "ListItem", position: 2, name: "Blog", item: absoluteSiteUrl("/blog/") },
					{ "@type": "ListItem", position: 3, name: post.title, item: pageUrl },
				],
			},
		],
	};
}

export function serializeJsonLd(value: JsonLdDocument): string {
	return JSON.stringify(value)
		.replaceAll("<", "\\u003c")
		.replaceAll(">", "\\u003e")
		.replaceAll("&", "\\u0026")
		.replaceAll("\u2028", "\\u2028")
		.replaceAll("\u2029", "\\u2029");
}
