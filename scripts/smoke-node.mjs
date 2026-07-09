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

	const keys = await fetch(`${origin}/keys`);
	assert.equal(keys.status, 200);
	assert.match(keys.headers.get("content-type") ?? "", /^text\/plain/);
	assert.equal(keys.headers.get("cache-control"), "public, max-age=3600");
	assert.match(await keys.text(), /cofob keys/);

	const sitemap = await fetch(`${origin}/sitemap.xml`);
	assert.equal(sitemap.status, 200);
	assert.match(sitemap.headers.get("content-type") ?? "", /^application\/xml/);
	assert.match(await sitemap.text(), /<urlset/);

	const missing = await fetch(`${origin}/missing`);
	assert.equal(missing.status, 404);

	console.log("Node adapter smoke tests passed");
} finally {
	if (server.exitCode === null) {
		server.kill("SIGTERM");
		await once(server, "exit");
	}
}
