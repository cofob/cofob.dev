import { describe, expect, it } from "vitest";
import { parseDocument, parseFeed } from "htmlparser2";
import { getPublicPosts } from "./catalog";
import { absolutizeHtmlUrls, renderAtomFeed, renderRssFeed } from "./feed";
import { absoluteSiteUrl } from "./url";
import { copyrightNotice, siteLicenseUrl } from "$lib/license";

describe("feed HTML URLs", () => {
	it("makes responsive images and attachments absolute", () => {
		const html =
			'<img src="/blog/test/image.webp" srcset="/blog/test/image-small.webp 480w, https://assets.example/image.webp 960w"><a href="guide.pdf">Guide</a>';
		expect(absolutizeHtmlUrls(html, "https://cofob.dev/blog/test/")).toBe(
			'<img src="https://cofob.dev/blog/test/image.webp" srcset="https://cofob.dev/blog/test/image-small.webp 480w, https://assets.example/image.webp 960w"><a href="https://cofob.dev/blog/test/guide.pdf">Guide</a>',
		);
	});
});

describe("portable feed content", () => {
	it.each([
		["RSS", renderRssFeed],
		["Atom", renderAtomFeed],
	])("simplifies complex post components in %s", (_name, renderFeed) => {
		const output = renderFeed();
		expect(output).toContain("@cofob wrote:");
		expect(output).toContain("Warning!");
		expect(output).toContain("Note:");
		expect(output).toContain("/blog/play_asciinema/?url=%2Fblog%2Fcodex-start%2F");
		expect(output).not.toContain("chat-avatar");
		expect(output).not.toContain('class="recording');
		expect(output).not.toContain("Загрузка плеера");
		expect(output).not.toContain("<!--[");
		expect(output).not.toMatch(/(?:<|&lt;)script\b/i);
		expect(output).not.toMatch(/\b(?:href|poster|src)=(?:"|&quot;)\/(?!\/)/);
	});

	it.each([
		["RSS", renderRssFeed, "rss"],
		["Atom", renderAtomFeed, "atom"],
	])("produces a parseable %s feed with every public post", (_name, renderFeed, expectedType) => {
		const output = renderFeed();
		const parsed = parseFeed(output);
		expect(parsed).not.toBeNull();
		expect(parsed?.type).toBe(expectedType);
		expect(parsed?.title).toBe("cofob.dev blog");
		expect(parsed?.link).toBe("https://cofob.dev/blog/");
		expect(parsed?.items).toHaveLength(getPublicPosts().length);
		expect(parsed?.items[0]).toMatchObject({
			title: getPublicPosts()[0].title,
			link: `https://cofob.dev/blog/${getPublicPosts()[0].slug}/`,
		});
		expect(parsed?.items[0].pubDate).toBeInstanceOf(Date);
		expect(Number.isNaN(parsed?.items[0].pubDate?.getTime())).toBe(false);
		expect(() => parseDocument(output, { xmlMode: true })).not.toThrow();
	});

	it("uses the social image as feed media and the first article image", () => {
		const post = getPublicPosts()[0];
		const image = post.socialImage;
		expect(image).toBeDefined();
		if (!image) throw new Error("Published test post needs a social image");
		const imageUrl = absoluteSiteUrl(image.src);

		const rss = renderRssFeed();
		expect(rss).toContain('xmlns:media="http://search.yahoo.com/mrss/"');
		expect(rss).toContain(
			`<media:content url="${imageUrl}" type="${image.type}" medium="image" width="${image.width}" height="${image.height}">`,
		);
		expect(rss).toContain(`<media:description type="plain">${image.alt}</media:description>`);
		const rssContent = rss.slice(rss.indexOf("<content:encoded>"));
		expect(rssContent.indexOf(`<img src="${imageUrl}"`)).toBe(rssContent.indexOf("<img"));

		const atom = renderAtomFeed();
		expect(atom).toContain(`<link rel="enclosure" href="${imageUrl}" type="${image.type}" />`);
		const atomContent = atom.slice(atom.indexOf('<content type="html"'));
		expect(atomContent.indexOf(`&lt;img src=&quot;${imageUrl}&quot;`)).toBe(atomContent.indexOf("&lt;img"));
	});

	it("publishes the content license in RSS and Atom", () => {
		const rss = renderRssFeed();
		expect(rss).toContain(`<copyright>${copyrightNotice}</copyright>`);
		expect(rss).toContain(`<dc:rights>${copyrightNotice} ${siteLicenseUrl}</dc:rights>`);

		const atom = renderAtomFeed();
		expect(atom).toContain(`<rights>${copyrightNotice}</rights>`);
		expect(atom).toContain(`<link href="${siteLicenseUrl}" rel="license" />`);
	});
});
