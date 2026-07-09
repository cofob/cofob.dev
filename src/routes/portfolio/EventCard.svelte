<script lang="ts">
	import type { Snippet } from "svelte";

	let { name, source, meta, children }: { name: string; source: string; meta: string; children: Snippet } = $props();
</script>

<li>
	<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL prop -->
	<a href={source} class="text-blue-500" target="_blank" rel="noreferrer">
		{name}
	</a>
	<div class="text-sm text-zinc-500">{meta}</div>
	<p class="mt-1">{@render children()}</p>
</li>
