export function formatPostDate(value: string, lang = "en"): string {
	const [year, month, day] = value.slice(0, 10).split("-").map(Number);
	return new Intl.DateTimeFormat(lang, { dateStyle: "long", timeZone: "UTC" }).format(
		new Date(Date.UTC(year, month - 1, day, 12)),
	);
}
