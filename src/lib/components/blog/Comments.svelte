<script lang="ts">
	import type { CommentsResult } from "$lib/fediverse/types";
	import {
		Alert,
		Button,
		Card,
		EmptyState,
		Heading,
		Inline,
		Link,
		Section,
		Stack,
		Text,
		TextField,
	} from "@cofob/design-system-svelte";
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
			const threadInput = document.querySelector<HTMLInputElement>("#fediverse-thread-url");
			threadInput?.select();
			copied = document.execCommand("copy");
		}
	}
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

<Section aria-labelledby="comments-heading" data-spacing="lg">
	<Stack gap="lg">
		<Inline justify="between" align="baseline">
			<Heading level={2} size="xl" id="comments-heading">Comments</Heading>
			<Link href={source} external rel="nofollow noopener noreferrer">View source thread</Link>
		</Inline>

		{#if mode === "manual" && !result}
			<Text>
				Comments are hosted on a remote Fediverse instance. Loading them will contact that instance and may load remote
				avatars or media.
			</Text>
			<Button onclick={loadComments} {loading}>{loading ? "Loading…" : "Load comments"}</Button>
		{:else if result?.state === "ready"}
			{#if result.stale}<Alert tone="warning">Showing cached comments because the remote instance is unavailable.</Alert
				>{/if}
			{#if result.comments.length > 0}
				<CommentThread comments={result.comments} {lang} />
			{:else}
				<EmptyState title="No replies yet" description="Be the first to continue the conversation." />
			{/if}
		{:else if result?.state === "error"}
			<Alert title="Comments unavailable" tone="warning">{result.message}</Alert>
			<Button onclick={loadComments} {loading}>{loading ? "Retrying…" : "Retry in browser"}</Button>
		{/if}

		<Card variant="outlined" padding="lg">
			<Stack gap="md">
				<Text
					>Reply from your Fediverse account by opening the thread, or copy its URL into your instance’s search.</Text
				>
				<TextField id="fediverse-thread-url" value={source} readonly label="Fediverse thread URL" />
				<Inline gap="sm">
					<Button variant="secondary" onclick={copyThreadUrl}>Copy URL</Button>
					<Link href={source} external rel="nofollow noopener noreferrer">Reply on the Fediverse</Link>
				</Inline>
				<Text size="sm" tone="muted" aria-live="polite">{copied ? "Thread URL copied." : ""}</Text>
			</Stack>
		</Card>
		<Text size="sm" tone="muted" aria-live="polite">{loading ? "Loading comments from the remote instance." : ""}</Text>
	</Stack>
</Section>
