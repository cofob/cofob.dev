<script lang="ts">
	import { getBlogRenderMode } from "$lib/blog/render-mode";
	import { ChatThread, type ChatMessage as DesignSystemChatMessage } from "@cofob/design-system-svelte";

	interface ChatMessage {
		text?: string;
		link?: string;
		linkLabel?: string;
	}

	let {
		author,
		avatar,
		messages,
		label = "Фрагмент переписки",
	}: { author: string; avatar: string; messages: ChatMessage[]; label?: string } = $props();
	const renderMode = getBlogRenderMode();
	let browserMessages = $derived<DesignSystemChatMessage[]>(
		messages.map((message, index) => ({
			id: `${author}-${index}`,
			author,
			text: message.text,
			link: message.link,
			linkLabel: message.linkLabel,
			linkExternal: Boolean(message.link),
			avatar: { src: avatar, alt: "" },
		})),
	);
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

{#snippet portableText(text: string)}
	{#each text.split("\n") as line, index (index)}
		{#if index > 0}<br />{/if}{line}
	{/each}
{/snippet}

{#if renderMode === "portable"}
	<blockquote aria-label={label}>
		<p><strong>@{author} wrote:</strong></p>
		{#each messages as message, index (index)}
			<p>
				{#if message.link}
					<a href={message.link}>{message.linkLabel ?? message.link}</a>{#if message.text}<br />{/if}
				{/if}
				{#if message.text}{@render portableText(message.text)}{/if}
			</p>
		{/each}
	</blockquote>
{:else}
	<ChatThread messages={browserMessages} {label} />
{/if}
