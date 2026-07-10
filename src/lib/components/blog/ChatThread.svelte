<script lang="ts">
	import type { Snippet } from "svelte";

	let { children, label = "Фрагмент переписки" }: { children: Snippet; label?: string } = $props();
</script>

<section class="chat" aria-label={label}>
	{@render children()}
</section>

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

	.chat :global(.chat-row:not(:first-child) .chat-avatar) {
		visibility: hidden;
	}

	.chat :global(.chat-bubble) {
		@apply relative max-w-[38rem] rounded-2xl rounded-bl-sm bg-white px-3 py-2 shadow-sm;
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
