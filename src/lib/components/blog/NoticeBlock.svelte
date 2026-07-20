<script lang="ts">
	import { getBlogRenderMode } from "$lib/blog/render-mode";
	import { Alert } from "@cofob/design-system-svelte";
	import type { Snippet } from "svelte";

	let { children, portableTitle = "Note:" }: { children: Snippet; portableTitle?: string } = $props();
	const renderMode = getBlogRenderMode();
</script>

{#if renderMode === "portable"}
	<blockquote>
		<p><strong>{portableTitle}</strong></p>
		<div>{@render children()}</div>
	</blockquote>
{:else}
	<Alert title="Note" tone="info" aria-label="Примечание">{@render children()}</Alert>
{/if}
