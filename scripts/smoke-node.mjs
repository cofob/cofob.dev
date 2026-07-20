import assert from "node:assert/strict";
import { once } from "node:events";
import { spawn } from "node:child_process";

const port = 41000 + (process.pid % 1000);
const origin = `http://127.0.0.1:${port}`;
const server = spawn(process.execPath, ["build/index.js"], {
	env: { ...process.env, HOST: "127.0.0.1", PORT: String(port) },
	stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => (serverOutput += chunk));
server.stderr.on("data", (chunk) => (serverOutput += chunk));

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForServer() {
	for (let attempt = 0; attempt < 50; attempt += 1) {
		if (server.exitCode !== null) throw new Error(`Server exited before startup:\n${serverOutput}`);
		try {
			const response = await fetch(`${origin}/`);
			if (response.ok) return response;
		} catch {
			// The server is still starting.
		}
		await delay(100);
	}
	throw new Error(`Server did not start in time:\n${serverOutput}`);
}

try {
	const home = await waitForServer();
	assert.equal(home.headers.get("cache-control"), "public, max-age=300");
	const homeHtml = await home.text();
	assert.match(homeHtml, /Hi! I/);
	assert.match(homeHtml, /application\/ld\+json/);
	assert.match(homeHtml, /content="1200" property="og:image:width"/);
	const socialPath = homeHtml.match(/content="https:\/\/cofob\.dev([^"?]+)" property="og:image"/)?.[1];
	assert.ok(socialPath);
	const social = await fetch(`${origin}${socialPath}`);
	assert.equal(social.status, 200);
	assert.match(social.headers.get("content-type") ?? "", /^image\/png/);

	const blog = await fetch(`${origin}/blog/`);
	assert.equal(blog.status, 200);
	assert.match(await blog.text(), /codex-start/);

	const post = await fetch(`${origin}/blog/codex-start/`);
	assert.equal(post.status, 200);
	const postText = await post.text();
	assert.match(postText, /Codex в отдельном контейнере/);
	assert.match(postText, /Открыть запись в плеере/);
	assert.doesNotMatch(postText, /Загрузка плеера/);

	const searchIndex = await fetch(`${origin}/blog/search.json`);
	assert.equal(searchIndex.status, 200);
	assert.match(searchIndex.headers.get("content-type") ?? "", /^application\/json/);
	assert.ok((await searchIndex.json()).some((entry) => entry.slug === "codex-start" && entry.tags.includes("project")));

	const taggedBlog = await fetch(`${origin}/blog/?tag=PROJECT`);
	assert.equal(taggedBlog.status, 200);
	assert.match(await taggedBlog.text(), /codex-start/);

	const draft = await fetch(`${origin}/blog/example-post/`);
	assert.equal(draft.status, 404);

	const license = await fetch(`${origin}/license/`);
	assert.equal(license.status, 200);
	const licenseText = await license.text();
	assert.match(licenseText, /Original cofob.dev source code and website content/);
	assert.match(licenseText, /source code, software, documentation, website content/);

	const robots = await fetch(`${origin}/robots.txt`);
	assert.equal(robots.status, 200);
	const robotsText = await robots.text();
	assert.match(robotsText, /User-agent: GPTBot[\s\S]*?Disallow: \//);
	assert.match(robotsText, /Content-Signal: ai-train=no, search=yes, ai-input=yes/);

	const rsl = await fetch(`${origin}/rsl.xml`);
	assert.equal(rsl.status, 200);
	assert.match(await rsl.text(), /<prohibits type="usage">ai-train<\/prohibits>/);

	const tdm = await fetch(`${origin}/.well-known/tdmrep.json`);
	assert.equal(tdm.status, 200);
	assert.deepEqual(await tdm.json(), [{ location: "/", "tdm-reservation": 1 }]);

	const keys = await fetch(`${origin}/keys`);
	assert.equal(keys.status, 200);
	assert.match(keys.headers.get("content-type") ?? "", /^text\/plain/);
	assert.equal(keys.headers.get("cache-control"), "public, max-age=3600");
	assert.match(await keys.text(), /cofob keys/);

	const sitemap = await fetch(`${origin}/sitemap.xml`);
	assert.equal(sitemap.status, 200);
	assert.match(sitemap.headers.get("content-type") ?? "", /^application\/xml/);
	assert.match(await sitemap.text(), /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
	assert.match(await (await fetch(`${origin}/sitemap.xml`)).text(), /https:\/\/cofob\.dev\/blog\//);

	const rss = await fetch(`${origin}/rss.xml`);
	assert.equal(rss.status, 200);
	assert.match(rss.headers.get("content-type") ?? "", /^application\/rss\+xml/);
	const rssText = await rss.text();
	assert.match(rssText, /<rss/);
	assert.match(rssText, /@cofob wrote:/);
	assert.match(rssText, /\/blog\/play_asciinema\/\?url=https%3A%2F%2Fsite-assets\.cofob\.dev%2F/);
	assert.match(rssText, /<media:content [^>]*medium="image"/);
	assert.match(
		rssText,
		/<content:encoded><!\[CDATA\[[\s\S]*?<img src="https:\/\/cofob\.dev\/blog\/codex-start\/social\./,
	);
	assert.doesNotMatch(rssText, /chat-avatar|Загрузка плеера/);

	const atom = await fetch(`${origin}/atom.xml`);
	assert.equal(atom.status, 200);
	assert.match(atom.headers.get("content-type") ?? "", /^application\/atom\+xml/);
	const atomText = await atom.text();
	assert.match(atomText, /<feed/);
	assert.match(atomText, /@cofob wrote:/);
	assert.match(atomText, /<link rel="enclosure" href="https:\/\/cofob\.dev\/blog\/codex-start\/social\./);
	assert.match(
		atomText,
		/<content type="html"[^>]*>[\s\S]*?&lt;img src=&quot;https:\/\/cofob\.dev\/blog\/codex-start\/social\./,
	);
	assert.doesNotMatch(atomText, /chat-avatar|Загрузка плеера/);

	const asciinemaPlayer = await fetch(
		`${origin}/blog/play_asciinema/?url=${encodeURIComponent("https://site-assets.cofob.dev/demo.cast")}`,
	);
	assert.equal(asciinemaPlayer.status, 200);
	assert.match(await asciinemaPlayer.text(), /Terminal recording/);

	const rejectedAsciinemaPlayer = await fetch(
		`${origin}/blog/play_asciinema/?url=${encodeURIComponent("https://evil.example/demo.cast")}`,
	);
	assert.equal(rejectedAsciinemaPlayer.status, 200);
	assert.match(await rejectedAsciinemaPlayer.text(), /Asciinema source must use https:\/\/site-assets\.cofob\.dev/);

	const missing = await fetch(`${origin}/missing`);
	assert.equal(missing.status, 404);

	console.log("Node adapter smoke tests passed");
} finally {
	if (server.exitCode === null) {
		server.kill("SIGTERM");
		await once(server, "exit");
	}
}
