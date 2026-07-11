import { buildTime, getPublicPosts, siteSocialImage } from "$lib/blog/catalog";
import { absoluteSiteUrl } from "$lib/blog/url";
import { escapeXml } from "$lib/blog/xml";

export const prerender = process.env.DEPLOY_TARGET === "static";

export async function GET() {
	const headers = {
		"Cache-Control": "public, max-age=3600",
		"Content-Type": "application/xml",
	};
	const posts = getPublicPosts();
	const latestPostChange =
		posts.length === 0
			? buildTime
			: posts
					.slice(1)
					.reduce(
						(latest, post) =>
							Date.parse(post.updated ?? post.published) > Date.parse(latest)
								? (post.updated ?? post.published)
								: latest,
						posts[0].updated ?? posts[0].published,
					);

	const staticPages = [
		{
			path: "/",
			priority: "1",
			changefreq: "weekly",
			lastmod: latestPostChange.slice(0, 10),
			images: siteSocialImage ? [siteSocialImage.src] : [],
		},
		{ path: "/blog/", priority: "0.8", changefreq: "weekly", lastmod: latestPostChange.slice(0, 10) },
	];
	const postPages = posts.map((post) => ({
		path: `/blog/${post.slug}/`,
		priority: "0.7",
		changefreq: "monthly",
		lastmod: (post.updated ?? post.published).slice(0, 10),
		images: [...new Set([post.cover?.src, post.socialImage?.src].filter((value): value is string => Boolean(value)))],
	}));
	const urls = [...staticPages, ...postPages]
		.map(
			(page) => `<url>
		<loc>${escapeXml(absoluteSiteUrl(page.path))}</loc>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
		<lastmod>${page.lastmod}</lastmod>
		${(page.images ?? []).map((image) => `<image:image><image:loc>${escapeXml(absoluteImageUrl(image))}</image:loc></image:image>`).join("\n\t\t")}
	</url>`,
		)
		.join("\n\t");

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
	${urls}
</urlset>`,
		{ headers: headers },
	);
}

function absoluteImageUrl(value: string): string {
	return value.startsWith("http://") || value.startsWith("https://") ? value : absoluteSiteUrl(value);
}
