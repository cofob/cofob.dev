<script lang="ts">
	import type { Snippet } from "svelte";

	let { children }: { children: Snippet } = $props();
</script>

<section class="max-w-screen-lg my-10 mx-2 lg:mx-auto">{@render children()}</section>
