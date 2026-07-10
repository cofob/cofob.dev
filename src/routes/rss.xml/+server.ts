import { renderRssFeed } from "$lib/blog/feed";

export const prerender = process.env.DEPLOY_TARGET === "static";

export function GET() {
	return new Response(renderRssFeed(), {
		headers: {
			"cache-control": "public, max-age=600",
			"content-type": "application/rss+xml; charset=utf-8",
		},
	});
}
