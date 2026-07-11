<script lang="ts">
	import { getBlogRenderMode } from "$lib/blog/render-mode";

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
	<section class="chat" aria-label={label}>
		{#each messages as message, index (index)}
			<div class="chat-row">
				<img class="chat-avatar" src={avatar} alt={index === messages.length - 1 ? `Аватар ${author}` : ""} />
				<div class="chat-bubble">
					{#if index === 0}<p class="chat-author">{author}</p>{/if}
					<p class="chat-text">
						{#if message.link}
							<a href={message.link} target="_blank" rel="noopener noreferrer">{message.linkLabel ?? message.link}</a
							>{#if message.text}<br />{/if}
						{/if}{message.text ?? ""}
					</p>
				</div>
			</div>
		{/each}
	</section>
{/if}

<style lang="postcss">
	@reference "../../app.css";

	.chat {
		@apply my-8 rounded-2xl bg-[#d7e3ec] p-3 sm:p-5;
		background-image:
			radial-gradient(circle at 20% 30%, rgb(255 255 255 / 24%) 0 1px, transparent 1.5px),
			radial-gradient(circle at 80% 70%, rgb(255 255 255 / 20%) 0 1px, transparent 1.5px);
		background-size:
			28px 28px,
			36px 36px;
	}

	.chat :global(.chat-row) {
		@apply grid grid-cols-[2.5rem_minmax(0,1fr)] items-end gap-2;
	}

	.chat :global(.chat-row + .chat-row) {
		@apply mt-1;
	}

	.chat :global(.chat-avatar) {
		@apply m-0! h-10! w-10! rounded-full! object-cover;
	}

	.chat :global(.chat-row:not(:last-child) .chat-avatar) {
		visibility: hidden;
	}

	.chat :global(.chat-bubble) {
		@apply relative max-w-[38rem] bg-white px-3 py-2 shadow-sm;
		border-radius: 0.3rem;
	}

	.chat :global(.chat-row:first-child:not(:last-child) .chat-bubble) {
		border-top-left-radius: 1rem;
		border-top-right-radius: 1rem;
	}

	.chat :global(.chat-row:last-child:not(:first-child) .chat-bubble) {
		border-bottom-right-radius: 1rem;
	}

	.chat :global(.chat-row:only-child .chat-bubble) {
		border-radius: 1rem;
	}

	.chat :global(.chat-author) {
		@apply m-0! text-sm font-bold leading-5 text-sky-700;
	}

	.chat :global(.chat-text) {
		@apply m-0! whitespace-pre-line text-[0.98rem] leading-6 text-zinc-800;
	}

	.chat :global(.chat-text a) {
		@apply break-all;
	}

	@media (max-width: 420px) {
		.chat :global(.chat-row) {
			grid-template-columns: 2rem minmax(0, 1fr);
		}

		.chat :global(.chat-avatar) {
			@apply h-8! w-8!;
		}
	}
</style>
