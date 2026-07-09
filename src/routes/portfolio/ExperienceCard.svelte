<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		company,
		location,
		title,
		date,
		children,
	}: { company: string; location: string; title: string; date: string; children: Snippet } = $props();
</script>

<div class="rounded-lg border-2 p-4 mb-4">
	<div class="text-lg font-semibold">{title}</div>
	<div class="text-sm text-zinc-500">{company} | {location}</div>
	<div class="text-sm text-zinc-500">{date}</div>
	{@render children()}
</div>
