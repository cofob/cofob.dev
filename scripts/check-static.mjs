import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";

const requiredFiles = [
	"build/200.html",
	"build/index.html",
	"build/ipfs-404.html",
	"build/blog/index.html",
	"build/keys",
	"build/keys-git",
	"build/pgp",
	"build/sitemap.xml",
	"build/rss.xml",
	"build/atom.xml",
	"build/_headers",
	"build/blog/search.json",
	"build/license/index.html",
	"build/robots.txt",
	"build/rsl.xml",
	"build/.well-known/tdmrep.json",
];

const contents = await Promise.all(requiredFiles.map((path) => readFile(path, "utf8")));
assert.equal(contents[0], contents[2]);
assert.notEqual(contents[0], contents[1]);
assert.match(contents[1], /Hi! I/);
assert.match(contents[3], /codex-start/);
assert.match(contents[1], /application\/ld\+json/);
assert.match(contents[1], /content="1200" property="og:image:width"/);
assert.match(contents[4], /cofob keys/);
assert.match(contents[7], /<urlset/);
assert.match(contents[7], /xmlns:image="http:\/\/www\.google\.com\/schemas\/sitemap-image\/1\.1"/);
assert.match(contents[8], /<rss/);
assert.match(contents[8], /<media:content [^>]*medium="image"/);
assert.match(contents[9], /<feed/);
assert.match(contents[9], /<link rel="enclosure" [^>]*type="image\/png"/);
assert.match(contents[10], /Content-Type: text\/plain; charset=utf-8/);
assert.match(contents[10], /Content-Type: application\/xml; charset=utf-8/);
assert.match(contents[10], /Content-Type: application\/rss\+xml; charset=utf-8/);
assert.match(contents[10], /Content-Type: application\/atom\+xml; charset=utf-8/);
assert.ok(JSON.parse(contents[11]).some((entry) => entry.slug === "codex-start" && entry.tags.includes("project")));
assert.match(contents[12], /Original cofob.dev source code and website content/);
assert.match(contents[12], /source code, software, documentation, website content/);
assert.match(contents[12], /rel="license" href="https:\/\/cofob\.dev\/license\/"/);
assert.match(contents[13], /User-agent: GPTBot[\s\S]*?Disallow: \//);
assert.match(contents[13], /Content-Signal: ai-train=no, search=yes, ai-input=yes/);
assert.match(contents[14], /<prohibits type="usage">ai-train<\/prohibits>/);
assert.deepEqual(JSON.parse(contents[15]), [{ location: "/", "tdm-reservation": 1 }]);

await assert.rejects(readFile("build/blog/example-post/index.html", "utf8"), { code: "ENOENT" });
assert.match(await readFile("build/blog/codex-start/index.html", "utf8"), /Codex в отдельном контейнере/);
assert.match(await readFile("build/blog/play_asciinema/index.html", "utf8"), /_app\/immutable\/nodes\//);
assert.ok((await readdir("build/blog/social")).some((name) => /^site\.[a-f0-9]{12}\.png$/.test(name)));

console.log("Static adapter artifact checks passed");
