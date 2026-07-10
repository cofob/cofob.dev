<script lang="ts">
	import type { FediverseAttachment } from "$lib/fediverse/types";

	let { attachments }: { attachments: FediverseAttachment[] } = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

{#if attachments.length > 0}
	<ul class="media-list" aria-label="Comment attachments">
		{#each attachments as attachment (attachment.url)}
			<li>
				{#if !attachment.description}
					<a href={attachment.url} target="_blank" rel="nofollow noopener noreferrer">View undescribed attachment</a>
				{:else if attachment.type === "image"}
					<a href={attachment.url} target="_blank" rel="nofollow noopener noreferrer">
						<img
							src={attachment.previewUrl ?? attachment.url}
							alt={attachment.description}
							loading="lazy"
							decoding="async"
							referrerpolicy="no-referrer"
						/>
					</a>
				{:else if attachment.type === "video" || attachment.type === "gifv"}
					<video controls preload="metadata" poster={attachment.previewUrl} aria-label={attachment.description}>
						<source src={attachment.url} />
						<a href={attachment.url}>View video attachment: {attachment.description}</a>
					</video>
				{:else if attachment.type === "audio"}
					<audio controls preload="metadata" aria-label={attachment.description}>
						<source src={attachment.url} />
						<a href={attachment.url}>Listen to attachment: {attachment.description}</a>
					</audio>
				{:else}
					<a href={attachment.url} target="_blank" rel="nofollow noopener noreferrer">{attachment.description}</a>
				{/if}
			</li>
		{/each}
	</ul>
{/if}

<style lang="postcss">
	@reference "../../app.css";

	.media-list {
		@apply mt-3 grid gap-2 sm:grid-cols-2;
	}

	a {
		@apply text-sky-700 underline underline-offset-2;
	}

	img,
	video {
		@apply max-w-full rounded-lg;
		max-height: 26rem;
	}

	audio {
		@apply max-w-full;
	}
</style>
