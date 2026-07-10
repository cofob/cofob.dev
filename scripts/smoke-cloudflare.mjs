import assert from "node:assert/strict";
import { spawn } from "node:child_process";

const port = 42000 + (process.pid % 1000);
const origin = `http://127.0.0.1:${port}`;
const executable = process.platform === "win32" ? "node_modules/.bin/wrangler.cmd" : "./node_modules/.bin/wrangler";
const server = spawn(executable, ["pages", "dev", "--port", String(port), "--ip", "127.0.0.1"], {
	detached: process.platform !== "win32",
	stdio: ["ignore", "pipe", "pipe"],
});

let serverOutput = "";
server.stdout.on("data", (chunk) => (serverOutput += chunk));
server.stderr.on("data", (chunk) => (serverOutput += chunk));

const delay = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function waitForServer() {
	for (let attempt = 0; attempt < 100; attempt += 1) {
		if (server.exitCode !== null) throw new Error(`Wrangler exited before startup:\n${serverOutput}`);
		try {
			const response = await fetch(`${origin}/`);
			if (response.ok) return response;
		} catch {
			// Wrangler is still starting.
		}
		await delay(100);
	}
	throw new Error(`Wrangler did not start in time:\n${serverOutput}`);
}

try {
	const home = await waitForServer();
	assert.equal(home.headers.get("cache-control"), "public, max-age=300");
	assert.match(await home.text(), /Hi! I/);

	const keys = await fetch(`${origin}/keys`);
	assert.equal(keys.status, 200);
	assert.match(keys.headers.get("content-type") ?? "", /^text\/plain/);
	assert.equal(keys.headers.get("cache-control"), "public, max-age=3600");
	assert.match(await keys.text(), /cofob keys/);

	const blog = await fetch(`${origin}/blog/`);
	assert.equal(blog.status, 200);
	assert.match(await blog.text(), /No posts have been published yet/);

	const sitemap = await fetch(`${origin}/sitemap.xml`);
	assert.equal(sitemap.status, 200);
	assert.match(sitemap.headers.get("content-type") ?? "", /^application\/xml/);
	assert.equal(sitemap.headers.get("cache-control"), "public, max-age=3600");
	assert.match(await sitemap.text(), /<urlset/);

	const rss = await fetch(`${origin}/rss.xml`);
	assert.equal(rss.status, 200);
	assert.match(rss.headers.get("content-type") ?? "", /^application\/rss\+xml/);

	const atom = await fetch(`${origin}/atom.xml`);
	assert.equal(atom.status, 200);
	assert.match(atom.headers.get("content-type") ?? "", /^application\/atom\+xml/);

	console.log("Cloudflare adapter smoke tests passed");
} finally {
	if (server.exitCode === null) {
		if (process.platform === "win32") server.kill("SIGTERM");
		else process.kill(-server.pid, "SIGTERM");
	}
}
