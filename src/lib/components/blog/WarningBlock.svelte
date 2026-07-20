<script lang="ts">
	import { getBlogRenderMode } from "$lib/blog/render-mode";
	import { Alert } from "@cofob/design-system-svelte";
	import type { Snippet } from "svelte";

	let { children, portableTitle = "Warning!" }: { children: Snippet; portableTitle?: string } = $props();
	const renderMode = getBlogRenderMode();
</script>

{#if renderMode === "portable"}
	<blockquote>
		<p><strong>{portableTitle}</strong></p>
		<div>{@render children()}</div>
	</blockquote>
{:else}
	<Alert title="Warning" tone="warning" aria-label="Предупреждение">{@render children()}</Alert>
{/if}
