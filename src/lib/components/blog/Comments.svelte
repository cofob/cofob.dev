<script lang="ts">
	import type { CommentsResult } from "$lib/fediverse/types";
	import CommentThread from "./CommentThread.svelte";

	let {
		source,
		lang,
		mode,
		initial,
	}: { source: string; lang: string; mode: "automatic" | "manual"; initial?: CommentsResult } = $props();

	let loadedResult = $state<CommentsResult | undefined>();
	let result = $derived(loadedResult ?? initial);
	let loading = $state(false);
	let copied = $state(false);
	let threadInput = $state<HTMLInputElement>();
	let cacheKey = $derived(`cofob-blog-comments:${source}`);

	async function loadComments() {
		loading = true;
		copied = false;

		try {
			const cached = sessionStorage.getItem(cacheKey);
			if (cached) {
				const parsed = JSON.parse(cached) as { storedAt: number; result: CommentsResult };
				if (
					Date.now() - parsed.storedAt < 10 * 60 * 1000 &&
					parsed.result.state === "ready" &&
					Array.isArray(parsed.result.comments)
				) {
					loadedResult = parsed.result;
					return;
				}
			}

			const { fetchFediverseComments } = await import("$lib/fediverse/comments");
			loadedResult = await fetchFediverseComments(source);
			if (loadedResult.state === "ready") {
				sessionStorage.setItem(cacheKey, JSON.stringify({ storedAt: Date.now(), result: loadedResult }));
			}
		} catch {
			loadedResult = { state: "error", message: "Comments could not be loaded in this browser." };
		} finally {
			loading = false;
		}
	}

	async function copyThreadUrl() {
		copied = false;
		try {
			await navigator.clipboard.writeText(source);
			copied = true;
		} catch {
			threadInput?.select();
			copied = document.execCommand("copy");
		}
	}
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

<section class="comments" aria-labelledby="comments-heading">
	<div class="comments-heading">
		<h2 id="comments-heading">Comments</h2>
		<a href={source} target="_blank" rel="nofollow noopener noreferrer">View source thread</a>
	</div>

	{#if mode === "manual" && !result}
		<p>
			Comments are hosted on a remote Fediverse instance. Loading them will contact that instance and may load remote
			avatars or media.
		</p>
		<button type="button" onclick={loadComments} disabled={loading}>{loading ? "Loading…" : "Load comments"}</button>
	{:else if result?.state === "ready"}
		{#if result.stale}<p class="notice">Showing cached comments because the remote instance is unavailable.</p>{/if}
		{#if result.comments.length > 0}
			<CommentThread comments={result.comments} {lang} />
		{:else}
			<p>No replies yet.</p>
		{/if}
	{:else if result?.state === "error"}
		<p class="notice">{result.message}</p>
		<button type="button" onclick={loadComments} disabled={loading}>{loading ? "Retrying…" : "Retry in browser"}</button
		>
	{/if}

	<div class="reply-box">
		<p>Reply from your Fediverse account by opening the thread, or copy its URL into your instance’s search.</p>
		<div class="reply-actions">
			<input bind:this={threadInput} value={source} readonly aria-label="Fediverse thread URL" />
			<button type="button" onclick={copyThreadUrl}>Copy URL</button>
			<a class="reply-link" href={source} target="_blank" rel="nofollow noopener noreferrer">Reply on the Fediverse</a>
		</div>
		<p class="copy-status" aria-live="polite">{copied ? "Thread URL copied." : ""}</p>
	</div>
	<p class="load-status" aria-live="polite">{loading ? "Loading comments from the remote instance." : ""}</p>
</section>

<style lang="postcss">
	@reference "../../app.css";

	.comments {
		@apply mt-12 border-t-2 border-zinc-100 pt-8;
	}

	.comments-heading {
		@apply mb-4 flex flex-wrap items-baseline justify-between gap-2;
	}

	h2 {
		@apply text-3xl font-semibold;
	}

	a {
		@apply text-sky-700 underline underline-offset-2;
	}

	button,
	.reply-link {
		@apply mt-3 inline-flex min-h-11 items-center justify-center rounded-lg border-2 border-zinc-800 bg-white px-3 py-2 font-semibold text-zinc-800 no-underline;
	}

	button:hover,
	.reply-link:hover {
		@apply bg-zinc-100;
	}

	button:disabled {
		@apply cursor-wait opacity-60;
	}

	.notice {
		@apply mb-3 rounded-lg bg-zinc-100 p-3;
	}

	.reply-box {
		@apply mt-6 rounded-lg bg-zinc-100 p-4;
	}

	.reply-actions {
		@apply flex flex-col items-stretch gap-2 sm:flex-row sm:items-center;
	}

	.reply-actions input {
		@apply mt-3 min-h-11 min-w-0 flex-1 rounded-lg border-2 border-zinc-500 bg-white px-3;
	}

	.copy-status,
	.load-status {
		@apply mt-2 min-h-6 text-sm text-zinc-600;
	}
</style>
