import { describe, expect, it } from "vitest";
import { fetchFediverseComments, getFediverseContextUrl } from "./comments";

describe("Fediverse comment URLs", () => {
	it("supports Mastodon public and canonical status URLs", () => {
		expect(getFediverseContextUrl("https://social.example/@cofob/12345")).toBe(
			"https://social.example/api/v1/statuses/12345/context",
		);
		expect(getFediverseContextUrl("https://social.example/users/cofob/statuses/12345")).toBe(
			"https://social.example/api/v1/statuses/12345/context",
		);
	});

	it("supports Pleroma notice URLs and opaque IDs", () => {
		expect(getFediverseContextUrl("https://pleroma.example/notice/9hptFmVJ02khbzYJaS")).toBe(
			"https://pleroma.example/api/v1/statuses/9hptFmVJ02khbzYJaS/context",
		);
	});

	it("rejects insecure and unrelated URLs", () => {
		expect(() => getFediverseContextUrl("http://social.example/@cofob/12345")).toThrow();
		expect(() => getFediverseContextUrl("https://social.example/about")).toThrow();
	});
});

describe("Fediverse response normalization", () => {
	it("builds reply trees and strips unsafe remote markup", async () => {
		const response = {
			descendants: [
				status({
					id: "child",
					in_reply_to_id: "root",
					content:
						'<p>Hello<script>alert(1)</script><a href="javascript:alert(2)"> unsafe link</a> <img class="emoji" src="https://cdn.example/wave.png" alt=":wave:"></p>',
				}),
				status({ id: "grandchild", in_reply_to_id: "child", content: "<p>Nested reply</p>" }),
				status({ id: "private", visibility: "private", in_reply_to_id: "root" }),
			],
		};
		const fetcher = async () => new Response(JSON.stringify(response), { status: 200 });
		const result = await fetchFediverseComments("https://social.example/@cofob/root", fetcher as typeof fetch);

		expect(result.state).toBe("ready");
		if (result.state !== "ready") return;
		expect(result.comments).toHaveLength(1);
		expect(result.comments[0].replies[0].id).toBe("grandchild");
		expect(JSON.stringify(result.comments)).not.toContain("alert(1)");
		expect(JSON.stringify(result.comments)).not.toContain("javascript:");
		expect(JSON.stringify(result.comments)).toContain(":wave:");
	});

	it("keeps content warnings and accessible attachment metadata", async () => {
		const fetcher = async () =>
			new Response(
				JSON.stringify({
					descendants: [
						status({
							spoiler_text: "Photo warning",
							sensitive: true,
							media_attachments: [
								{
									type: "image",
									url: "https://cdn.example/image.jpg",
									preview_url: "https://cdn.example/preview.jpg",
									description: "A mountain at sunrise",
								},
							],
						}),
					],
				}),
				{ status: 200 },
			);
		const result = await fetchFediverseComments("https://pleroma.example/notice/root", fetcher as typeof fetch);

		expect(result.state).toBe("ready");
		if (result.state !== "ready") return;
		expect(result.comments[0].contentWarning).toBe("Photo warning");
		expect(result.comments[0].attachments[0].description).toBe("A mountain at sunrise");
	});

	it("returns a non-fatal error state for remote failures", async () => {
		const fetcher = async () => new Response("unavailable", { status: 429 });
		const result = await fetchFediverseComments("https://social.example/@cofob/12345", fetcher as typeof fetch);
		expect(result.state).toBe("error");
	});
});

function status(overrides: Record<string, unknown> = {}) {
	return {
		id: "comment",
		in_reply_to_id: "root",
		created_at: "2026-07-10T12:00:00.000Z",
		url: "https://social.example/@reader/comment",
		content: "<p>A comment</p>",
		spoiler_text: "",
		sensitive: false,
		visibility: "public",
		account: {
			display_name: "Reader",
			acct: "reader@social.example",
			url: "https://social.example/@reader",
			avatar_static: "https://cdn.example/avatar.png",
		},
		media_attachments: [],
		...overrides,
	};
}
