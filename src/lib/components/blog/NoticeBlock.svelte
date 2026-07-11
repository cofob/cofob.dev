<script lang="ts">
	import { getBlogRenderMode } from "$lib/blog/render-mode";
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
	<aside class="notice" aria-label="Примечание">
		{@render children()}
	</aside>
{/if}

<style lang="postcss">
	@reference "../../app.css";

	.notice {
		@apply my-6 rounded-xl border-2 border-sky-300 bg-sky-50 px-4 py-3 text-zinc-800;
	}

	.notice :global(p) {
		@apply my-0!;
	}
</style>
