export function getSiteOrigin(): URL {
	const configured = import.meta.env.VITE_DOMAIN?.trim() || "cofob.dev";
	const origin = new URL(configured.includes("://") ? configured : `https://${configured}`);
	if (origin.protocol !== "https:" && origin.hostname !== "localhost" && origin.hostname !== "127.0.0.1") {
		throw new Error("VITE_DOMAIN must use HTTPS in production");
	}
	return new URL("/", origin);
}

export function absoluteSiteUrl(pathname: string): string {
	return new URL(pathname, getSiteOrigin()).href;
}
