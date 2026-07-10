<script lang="ts">
	import type { RichTextNode } from "$lib/fediverse/types";

	let { nodes }: { nodes: RichTextNode[] } = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

{#snippet renderNodes(items: RichTextNode[])}
	{#each items as node (node)}
		{#if node.type === "text"}
			{node.value}
		{:else if node.type === "break"}
			<br />
		{:else if node.type === "emoji"}
			<img
				class="emoji"
				src={node.src}
				alt={node.alt}
				width="20"
				height="20"
				loading="lazy"
				referrerpolicy="no-referrer"
			/>
		{:else if node.tag === "p"}
			<p>{@render renderNodes(node.children)}</p>
		{:else if node.tag === "link"}
			<a href={node.href} target="_blank" rel="nofollow noopener noreferrer">{@render renderNodes(node.children)}</a>
		{:else if node.tag === "strong"}
			<strong>{@render renderNodes(node.children)}</strong>
		{:else if node.tag === "em"}
			<em>{@render renderNodes(node.children)}</em>
		{:else if node.tag === "code"}
			<code>{@render renderNodes(node.children)}</code>
		{:else if node.tag === "blockquote"}
			<blockquote>{@render renderNodes(node.children)}</blockquote>
		{:else if node.tag === "ul"}
			<ul>{@render renderNodes(node.children)}</ul>
		{:else if node.tag === "ol"}
			<ol>{@render renderNodes(node.children)}</ol>
		{:else if node.tag === "li"}
			<li>{@render renderNodes(node.children)}</li>
		{/if}
	{/each}
{/snippet}

<div class="rich-text">{@render renderNodes(nodes)}</div>

<style lang="postcss">
	@reference "../../app.css";

	.rich-text :global(p + p) {
		@apply mt-2;
	}

	.rich-text :global(a) {
		@apply text-sky-700 underline underline-offset-2;
	}

	.rich-text :global(blockquote) {
		@apply border-l-2 border-zinc-500 pl-3 my-2 text-zinc-600;
	}

	.rich-text :global(ul) {
		@apply list-disc ml-5;
	}

	.rich-text :global(ol) {
		@apply list-decimal ml-5;
	}

	.rich-text :global(code) {
		@apply bg-zinc-100 rounded px-1;
	}

	.emoji {
		display: inline-block;
		width: 1.25em;
		height: 1.25em;
		vertical-align: -0.2em;
	}
</style>
