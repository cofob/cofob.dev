const ASCIINEMA_PATH = /^\/blog\/[a-z0-9]+(?:-[a-z0-9]+)*\/[a-z0-9]+(?:-[a-z0-9]+)*\.[a-f0-9]{12}\.cast$/u;

export function validateAsciinemaSource(value: string): string {
	if (!ASCIINEMA_PATH.test(value)) {
		throw new Error("Asciinema source must be a local content-hashed .cast asset");
	}
	return value;
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
