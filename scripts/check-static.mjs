import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const requiredFiles = [
	"build/200.html",
	"build/index.html",
	"build/ipfs-404.html",
	"build/portfolio/index.html",
	"build/blog/index.html",
	"build/keys",
	"build/keys-git",
	"build/pgp",
	"build/sitemap.xml",
	"build/rss.xml",
	"build/atom.xml",
	"build/_headers",
];

const contents = await Promise.all(requiredFiles.map((path) => readFile(path, "utf8")));
assert.equal(contents[0], contents[2]);
assert.notEqual(contents[0], contents[1]);
assert.match(contents[1], /Hi! I/);
assert.match(contents[3], /NDA company/);
assert.match(contents[4], /codex-start/);
assert.match(contents[1], /application\/ld\+json/);
assert.match(contents[1], /content="1200" property="og:image:width"/);
assert.match(contents[5], /cofob keys/);
assert.match(contents[8], /<urlset/);
assert.match(contents[8], /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
assert.match(contents[9], /<rss/);
assert.match(contents[10], /<feed/);
assert.match(contents[11], /Content-Type: text\/plain; charset=utf-8/);
assert.match(contents[11], /Content-Type: application\/xml; charset=utf-8/);
assert.match(contents[11], /Content-Type: application\/rss\+xml; charset=utf-8/);
assert.match(contents[11], /Content-Type: application\/atom\+xml; charset=utf-8/);

await assert.rejects(readFile("build/blog/example-post/index.html", "utf8"), { code: "ENOENT" });
assert.match(await readFile("build/blog/codex-start/index.html", "utf8"), /Codex в отдельном контейнере/);
assert.ok((await readdir("build/blog/social")).some((name) => /^site\.[a-f0-9]{12}\.png$/.test(name)));

console.log("Static adapter artifact checks passed");
