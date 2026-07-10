import { fetchFediverseComments } from "$lib/fediverse/comments";
import type { CommentsResult } from "$lib/fediverse/types";

const FRESH_TTL = 10 * 60 * 1000;
const ERROR_TTL = 60 * 1000;
const STALE_TTL = 60 * 60 * 1000;
const MAX_ENTRIES = 100;

interface CacheEntry {
	result: CommentsResult;
	storedAt: number;
	expiresAt: number;
}

const memoryCache = new Map<string, CacheEntry>();

export async function getServerComments(source: string, fetcher: typeof fetch): Promise<CommentsResult> {
	const now = Date.now();
	const cached = memoryCache.get(source);
	if (cached && cached.expiresAt > now) return cached.result;

	const edgeResult = await readCloudflareCache(source);
	if (edgeResult) {
		setMemoryCache(source, edgeResult, FRESH_TTL);
		return edgeResult;
	}

	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), 5000);
	const result = await fetchFediverseComments(source, fetcher, controller.signal).finally(() => clearTimeout(timeout));

	if (result.state === "error" && cached?.result.state === "ready" && now - cached.storedAt <= STALE_TTL) {
		return { ...cached.result, stale: true };
	}

	setMemoryCache(source, result, result.state === "ready" ? FRESH_TTL : ERROR_TTL);
	if (result.state === "ready") await writeCloudflareCache(source, result);
	return result;
}

function setMemoryCache(source: string, result: CommentsResult, ttl: number) {
	if (memoryCache.has(source)) memoryCache.delete(source);
	memoryCache.set(source, { result, storedAt: Date.now(), expiresAt: Date.now() + ttl });
	while (memoryCache.size > MAX_ENTRIES) memoryCache.delete(memoryCache.keys().next().value as string);
}

function cloudflareCache(): Cache | undefined {
	const cacheStorage = (globalThis as typeof globalThis & { caches?: CacheStorage & { default?: Cache } }).caches;
	return cacheStorage?.default;
}

function cacheKey(source: string): Request {
	return new Request(`https://cofob.dev/.internal/fediverse-comments/${encodeURIComponent(source)}`);
}

async function readCloudflareCache(source: string): Promise<CommentsResult | undefined> {
	const cache = cloudflareCache();
	if (!cache) return;
	try {
		const response = await cache.match(cacheKey(source));
		return response?.ok ? ((await response.json()) as CommentsResult) : undefined;
	} catch {
		return;
	}
}

async function writeCloudflareCache(source: string, result: CommentsResult) {
	const cache = cloudflareCache();
	if (!cache) return;
	try {
		await cache.put(
			cacheKey(source),
			new Response(JSON.stringify(result), {
				headers: { "cache-control": "s-maxage=600", "content-type": "application/json" },
			}),
		);
	} catch {
		// Cache API failures must not make article rendering fail.
	}
}
