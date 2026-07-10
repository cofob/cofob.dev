<script lang="ts">
	import type { Snippet } from "svelte";

	let { url, name, meta, children }: { url: string; name: string; meta: string; children: Snippet } = $props();
</script>

<!-- eslint-disable-next-line svelte/no-navigation-without-resolve -- external URL prop -->
<a href={url} class="text-blue-700" target="_blank" rel="noreferrer">
	{name}
</a>
<div class="text-sm text-zinc-500">{meta}</div>
<p class="mt-1">{@render children()}</p>
