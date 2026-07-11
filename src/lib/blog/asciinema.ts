const ASCIINEMA_ASSET_ORIGIN = "https://site-assets.cofob.dev";

export function validateAsciinemaSource(value: string): string {
	let source: URL;
	try {
		source = new URL(value);
	} catch {
		throw new Error("Asciinema source must be a valid absolute URL");
	}

	if (source.origin !== ASCIINEMA_ASSET_ORIGIN || source.username || source.password) {
		throw new Error(`Asciinema source must use ${ASCIINEMA_ASSET_ORIGIN}`);
	}

	return source.href;
}

export function asciinemaPlayerHref(source: string): string {
	const search = new URLSearchParams({ url: validateAsciinemaSource(source) });
	return `/blog/play_asciinema/?${search}`;
}

export function getAsciinemaPageData(
	url: URL,
): { source: string; error?: undefined } | { source?: undefined; error: string } {
	const value = url.searchParams.get("url");
	if (!value) return { error: "Recording URL is missing." };

	try {
		return { source: validateAsciinemaSource(value) };
	} catch (error) {
		return { error: error instanceof Error ? error.message : "Recording URL is invalid." };
	}
}
