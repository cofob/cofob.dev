<script lang="ts">
	import { TerminalCodeBlock as DesignSystemTerminalCodeBlock } from "@cofob/design-system-svelte";
	import type { TerminalCodeEntry } from "@cofob/design-system-css";
	import { getBlogRenderMode } from "$lib/blog/render-mode";

	let {
		entries,
		label = "Terminal",
		prompt = "$",
	}: {
		entries: readonly TerminalCodeEntry[];
		label?: string;
		prompt?: string;
	} = $props();

	const renderMode = getBlogRenderMode();
</script>

{#if renderMode === "portable"}
	<figure aria-label={label}>
		<figcaption>{label}</figcaption>
		{#each entries as entry, index (`${entry.command}:${index}`)}
			<pre><code>{prompt} {entry.command}{entry.output === undefined ? "" : `\n${entry.output}`}</code></pre>
		{/each}
	</figure>
{:else}
	<DesignSystemTerminalCodeBlock {entries} {label} {prompt} />
{/if}
