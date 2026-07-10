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
	assert.match(await home.text(), /Hi! I/);

	const portfolio = await fetch(`${origin}/portfolio/`);
	assert.equal(portfolio.status, 200);
	assert.match(await portfolio.text(), /NDA company/);

	const blog = await fetch(`${origin}/blog/`);
	assert.equal(blog.status, 200);
	assert.match(await blog.text(), /No posts have been published yet/);

	const draft = await fetch(`${origin}/blog/example-post/`);
	assert.equal(draft.status, 404);

	const keys = await fetch(`${origin}/keys`);
	assert.equal(keys.status, 200);
	assert.match(keys.headers.get("content-type") ?? "", /^text\/plain/);
	assert.equal(keys.headers.get("cache-control"), "public, max-age=3600");
	assert.match(await keys.text(), /cofob keys/);

	const sitemap = await fetch(`${origin}/sitemap.xml`);
	assert.equal(sitemap.status, 200);
	assert.match(sitemap.headers.get("content-type") ?? "", /^application\/xml/);
	assert.match(await sitemap.text(), /<urlset/);
	assert.match(await (await fetch(`${origin}/sitemap.xml`)).text(), /https:\/\/cofob\.dev\/blog\//);

	const rss = await fetch(`${origin}/rss.xml`);
	assert.equal(rss.status, 200);
	assert.match(rss.headers.get("content-type") ?? "", /^application\/rss\+xml/);
	assert.match(await rss.text(), /<rss/);

	const atom = await fetch(`${origin}/atom.xml`);
	assert.equal(atom.status, 200);
	assert.match(atom.headers.get("content-type") ?? "", /^application\/atom\+xml/);
	assert.match(await atom.text(), /<feed/);

	const missing = await fetch(`${origin}/missing`);
	assert.equal(missing.status, 404);

	console.log("Node adapter smoke tests passed");
} finally {
	if (server.exitCode === null) {
		server.kill("SIGTERM");
		await once(server, "exit");
	}
}
