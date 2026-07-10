import { buildTime, getPublicPosts } from "$lib/blog/catalog";
import { absoluteSiteUrl } from "$lib/blog/url";
import { escapeXml } from "$lib/blog/xml";

export const prerender = process.env.DEPLOY_TARGET === "static";

export async function GET() {
	const headers = {
		"Cache-Control": "public, max-age=3600",
		"Content-Type": "application/xml",
	};

	const staticPages = [
		{ path: "/", priority: "1", changefreq: "weekly", lastmod: "2025-05-20" },
		{ path: "/blog/", priority: "0.8", changefreq: "weekly", lastmod: buildTime.slice(0, 10) },
		{ path: "/portfolio/", priority: "0.7", changefreq: "weekly", lastmod: "2025-05-20" },
	];
	const postPages = getPublicPosts().map((post) => ({
		path: `/blog/${post.slug}/`,
		priority: "0.7",
		changefreq: "monthly",
		lastmod: (post.updated ?? post.published).slice(0, 10),
	}));
	const urls = [...staticPages, ...postPages]
		.map(
			(page) => `<url>
		<loc>${escapeXml(absoluteSiteUrl(page.path))}</loc>
		<changefreq>${page.changefreq}</changefreq>
		<priority>${page.priority}</priority>
		<lastmod>${page.lastmod}</lastmod>
	</url>`,
		)
		.join("\n\t");

	return new Response(
		`<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
	${urls}
</urlset>`,
		{ headers: headers },
	);
}
