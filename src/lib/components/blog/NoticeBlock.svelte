<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<aside class="notice" aria-label="Примечание">
	{@render children()}
</aside>

<style lang="postcss">
	@reference "../../app.css";

	.notice {
		@apply my-6 rounded-xl border-2 border-sky-300 bg-sky-50 px-4 py-3 text-zinc-800;
	}

	.notice :global(p) {
		@apply my-0!;
	}
</style>
