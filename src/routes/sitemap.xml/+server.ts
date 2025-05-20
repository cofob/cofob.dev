export async function GET() {
	const headers = {
		"Cache-Control": "public, max-age=3600",
		"Content-Type": "application/xml",
	};

	return new Response(
		`<?xml version="1.0" encoding="UTF-8" ?>
<urlset
	xmlns="https://www.sitemaps.org/schemas/sitemap/0.9"
	xmlns:news="https://www.google.com/schemas/sitemap-news/0.9"
	xmlns:xhtml="https://www.w3.org/1999/xhtml"
	xmlns:mobile="https://www.google.com/schemas/sitemap-mobile/1.0"
	xmlns:image="https://www.google.com/schemas/sitemap-image/1.1"
	xmlns:video="https://www.google.com/schemas/sitemap-video/1.1"
>
	<url>
		<loc>/</loc>
		<changefreq>weekly</changefreq>
		<priority>1</priority>
		<lastmod>2025-05-20</lastmod>
	</url>
	<url>
		<loc>/portfolio/</loc>
		<changefreq>weekly</changefreq>
		<priority>0.7</priority>
		<lastmod>2025-05-20</lastmod>
	</url>
</urlset>`,
		{ headers: headers },
	);
}
