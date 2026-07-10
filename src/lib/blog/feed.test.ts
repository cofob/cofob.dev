import { describe, expect, it } from "vitest";
import { absolutizeHtmlUrls } from "./feed";

describe("feed HTML URLs", () => {
	it("makes responsive images and attachments absolute", () => {
		const html =
			'<img src="/blog/test/image.webp" srcset="/blog/test/image-small.webp 480w, https://assets.example/image.webp 960w"><a href="guide.pdf">Guide</a>';
		expect(absolutizeHtmlUrls(html, "https://cofob.dev/blog/test/")).toBe(
			'<img src="https://cofob.dev/blog/test/image.webp" srcset="https://cofob.dev/blog/test/image-small.webp 480w, https://assets.example/image.webp 960w"><a href="https://cofob.dev/blog/test/guide.pdf">Guide</a>',
		);
	});
});
