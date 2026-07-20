import { readFile, readdir } from "node:fs/promises";
import { extname, join, relative } from "node:path";

const root = new URL("..", import.meta.url);
const sourceRoots = ["src", "scripts"];
const sourceExtensions = new Set([".css", ".js", ".mjs", ".svelte", ".ts"]);
const forbidden = [
	[/@apply\b/u, "Tailwind @apply"],
	[/@reference\b/u, "Tailwind @reference"],
	[/<style(?:\s|>)/u, "authored Svelte style block"],
	[/\b(?:sm|md|lg|xl|2xl):[A-Za-z0-9_-]+/u, "responsive utility class"],
];

async function files(directory) {
	const entries = await readdir(new URL(`${directory}/`, root), { withFileTypes: true });
	const nested = await Promise.all(
		entries.map((entry) => {
			const path = join(directory, entry.name);
			return entry.isDirectory() ? files(path) : [path];
		}),
	);
	return nested.flat();
}

const violations = [];
for (const path of (await Promise.all(sourceRoots.map(files))).flat()) {
	if (!sourceExtensions.has(extname(path))) continue;
	if (path === "scripts/check-style-boundary.mjs") continue;
	const source = await readFile(new URL(`../${path}`, import.meta.url), "utf8");
	for (const [pattern, label] of forbidden) {
		if (pattern.test(source)) violations.push(`${relative(".", path)}: ${label}`);
	}
}

const packageJson = JSON.parse(await readFile(new URL("../package.json", import.meta.url), "utf8"));
for (const name of ["tailwindcss", "@tailwindcss/postcss", "postcss"]) {
	if (packageJson.dependencies?.[name] || packageJson.devDependencies?.[name]) {
		violations.push(`package.json: disallowed styling dependency ${name}`);
	}
}

if (violations.length) {
	throw new Error(`Design-system style boundary failed:\n${violations.join("\n")}`);
}

console.log("cofob.dev styling is provided exclusively by the cofob design system.");
