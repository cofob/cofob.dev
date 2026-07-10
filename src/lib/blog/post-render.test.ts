import { render } from "svelte/server";
import { describe, expect, it } from "vitest";
import ExamplePost, { metadata } from "./posts/example-post.md";

describe("MDsveX post rendering", () => {
	it("renders the draft template as semantic server HTML", () => {
		const output = render(ExamplePost).body;
		expect(metadata.title).toBe("Example blog post");
		expect(metadata.draft).toBe(true);
		expect(output).toContain("<h2>A section heading</h2>");
		expect(output).toContain('<pre tabindex="0" role="region" aria-label="Scrollable code example in ts"');
	});
});
