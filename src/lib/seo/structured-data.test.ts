import { describe, expect, it } from "vitest";
import type { PostMetadata, SocialImageAsset } from "$lib/blog/types";
import { homeStructuredData, postStructuredData, serializeJsonLd } from "./structured-data";

const image: SocialImageAsset = {
	src: "https://site-assets.cofob.dev/blog/test/social.png",
	width: 1200,
	height: 630,
	type: "image/png",
	alt: "Test social image",
};

const post: PostMetadata = {
	slug: "test-post",
	title: "Test post",
	description: "Structured data fixture",
	published: "2026-01-01T10:00:00+00:00",
	updated: "2026-01-02T11:00:00+00:00",
	lang: "en",
	draft: false,
	socialImage: image,
	isPublic: true,
};

describe("structured data", () => {
	it("uses stable linked identities and the configured modification date", () => {
		const document = postStructuredData(post, image);
		const graph = document["@graph"] as Array<Record<string, unknown>>;
		const person = graph.find((entry) => entry["@type"] === "Person");
		const article = graph.find((entry) => entry["@type"] === "BlogPosting");
		expect(person).toMatchObject({
			"@id": "https://cofob.dev/#person",
			name: "Egor Ternovoi",
			alternateName: "cofob",
			sameAs: ["https://github.com/cofob/"],
		});
		expect(article).toMatchObject({
			"@id": "https://cofob.dev/blog/test-post/#article",
			datePublished: post.published,
			dateModified: post.updated,
			image: image.src,
		});
	});

	it("emits Person and WebSite on the home page", () => {
		const graph = homeStructuredData(image)["@graph"] as Array<Record<string, unknown>>;
		expect(graph.map((entry) => entry["@type"])).toEqual(["Person", "WebSite"]);
	});

	it("escapes characters that could terminate a JSON-LD script", () => {
		const serialized = serializeJsonLd({ value: "</script>&\u2028" });
		expect(serialized).not.toContain("</script>");
		expect(serialized).toContain("\\u003c/script\\u003e\\u0026\\u2028");
	});
});
