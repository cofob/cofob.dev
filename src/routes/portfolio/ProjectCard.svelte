<script lang="ts">
	import type { Snippet } from "svelte";

	let { name, source, children }: { name: string; source: string; children: Snippet } = $props();
</script>

<div class="rounded-lg border-2">
	<div class="m-2 flex flex-col min-h-full">
		<p class="font-medium text-center">{name}</p>
		<p class="mt-1 mx-1" style="flex: 1">{@render children()}</p>
		<!-- eslint-disable svelte/no-navigation-without-resolve -- external URL prop -->
		<a
			href={source}
			target="_blank"
			rel="noreferrer"
			class="mt-2 mb-4 flex h-8 items-center justify-center rounded-lg border-2 hover:bg-zinc-100 motion-safe:transition-colors"
		>
			Source code
		</a>
		<!-- eslint-enable svelte/no-navigation-without-resolve -->
	</div>
</div>
