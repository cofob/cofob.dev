import { describe, expect, it } from "vitest";
import { asciinemaPlayerHref, getAsciinemaPageData, validateAsciinemaSource } from "./asciinema";

describe("asciinema source URLs", () => {
	it("accepts only local content-hashed recordings", () => {
		expect(validateAsciinemaSource("/blog/demo/session.0123456789ab.cast")).toBe(
			"/blog/demo/session.0123456789ab.cast",
		);
		expect(asciinemaPlayerHref("/blog/demo/session.0123456789ab.cast")).toBe(
			"/blog/play_asciinema/?url=%2Fblog%2Fdemo%2Fsession.0123456789ab.cast",
		);
	});

	it.each([
		"https://assets.example/demo.cast",
		"/blog/demo/session.cast",
		"/blog/demo/session.0123456789ab.cast?download=1",
		"/blog/../session.0123456789ab.cast",
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
		).toEqual({ error: "Asciinema source must be a local content-hashed .cast asset" });
		expect(
			getAsciinemaPageData(
				new URL("https://cofob.dev/blog/play_asciinema/?url=%2Fblog%2Fdemo%2Fsession.0123456789ab.cast"),
			),
		).toEqual({ source: "/blog/demo/session.0123456789ab.cast" });
	});
});
