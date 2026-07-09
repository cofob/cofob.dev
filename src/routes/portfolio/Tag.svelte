<script lang="ts">
	import type { Snippet } from "svelte";

	let {
		bg = "bg-zinc-100",
		border = "",
		textColor = "text-zinc-700",
		children,
	}: { bg?: string; border?: string; textColor?: string; children: Snippet } = $props();
</script>

<span class="{bg} {textColor} py-1 px-3 rounded-lg text-sm {border}">{@render children()}</span>
