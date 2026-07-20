<script lang="ts">
	import type { RichTextNode } from "$lib/fediverse/types";
	import { InlineEmoji, Prose } from "@cofob/design-system-svelte";

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
			<InlineEmoji image={{ src: node.src, alt: node.alt, width: 20, height: 20 }} />
		{:else if node.tag === "p"}
			<p>{@render renderNodes(node.children)}</p>
		{:else if node.tag === "link"}
			<a class="cf-link" href={node.href} target="_blank" rel="nofollow noopener noreferrer"
				>{@render renderNodes(node.children)}</a
			>
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

<Prose>{@render renderNodes(nodes)}</Prose>
