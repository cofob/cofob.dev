import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const requiredFiles = [
	"build/200.html",
	"build/index.html",
	"build/ipfs-404.html",
	"build/portfolio/index.html",
	"build/keys",
	"build/keys-git",
	"build/pgp",
	"build/sitemap.xml",
	"build/_headers",
];

const contents = await Promise.all(requiredFiles.map((path) => readFile(path, "utf8")));
assert.equal(contents[0], contents[1]);
assert.equal(contents[0], contents[2]);
assert.match(contents[3], /NDA company/);
assert.match(contents[4], /cofob keys/);
assert.match(contents[7], /<urlset/);
assert.match(contents[8], /Content-Type: text\/plain; charset=utf-8/);
assert.match(contents[8], /Content-Type: application\/xml; charset=utf-8/);

console.log("Static adapter artifact checks passed");
