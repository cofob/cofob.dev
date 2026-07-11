import { describe, expect, it } from "vitest";
import { asciinemaPlayerHref, getAsciinemaPageData, validateAsciinemaSource } from "./asciinema";

describe("asciinema source URLs", () => {
	it("accepts recordings from the exact HTTPS assets origin", () => {
		expect(validateAsciinemaSource("https://site-assets.cofob.dev/demo/session.cast?raw=1")).toBe(
			"https://site-assets.cofob.dev/demo/session.cast?raw=1",
		);
		expect(asciinemaPlayerHref("https://site-assets.cofob.dev/demo.cast")).toBe(
			"/blog/play_asciinema/?url=https%3A%2F%2Fsite-assets.cofob.dev%2Fdemo.cast",
		);
	});

	it.each([
		"http://site-assets.cofob.dev/demo.cast",
		"https://other.site-assets.cofob.dev/demo.cast",
		"https://cofob.dev/demo.cast",
		"https://user@site-assets.cofob.dev/demo.cast",
		"https://site-assets.cofob.dev:444/demo.cast",
		"not a URL",
	])("rejects a disallowed source: %s", (source) => {
		expect(() => validateAsciinemaSource(source)).toThrow();
	});

	it("resolves player-page query data without loading rejected sources", () => {
		expect(getAsciinemaPageData(new URL("https://cofob.dev/blog/play_asciinema/"))).toEqual({
			error: "Recording URL is missing.",
		});
		expect(
			getAsciinemaPageData(
				new URL("https://cofob.dev/blog/play_asciinema/?url=https%3A%2F%2Fevil.example%2Fdemo.cast"),
			),
		).toEqual({ error: "Asciinema source must use https://site-assets.cofob.dev" });
		expect(
			getAsciinemaPageData(
				new URL("https://cofob.dev/blog/play_asciinema/?url=https%3A%2F%2Fsite-assets.cofob.dev%2Fdemo.cast"),
			),
		).toEqual({ source: "https://site-assets.cofob.dev/demo.cast" });
	});
});
