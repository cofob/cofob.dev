<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<aside class="warning" aria-label="Предупреждение">
	<strong>Warning:</strong>
	<div>{@render children()}</div>
</aside>

<style lang="postcss">
	@reference "../../app.css";

	.warning {
		@apply my-6 rounded-xl border-2 border-amber-400 bg-amber-50 px-4 py-3 text-zinc-800;
	}

	.warning strong {
		@apply block font-bold text-amber-900;
	}

	.warning div :global(p) {
		@apply my-1!;
	}
</style>
