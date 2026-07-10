import { renderAtomFeed } from "$lib/blog/feed";

export const prerender = process.env.DEPLOY_TARGET === "static";

export function GET() {
	return new Response(renderAtomFeed(), {
		headers: {
			"cache-control": "public, max-age=600",
			"content-type": "application/atom+xml; charset=utf-8",
		},
	});
}
