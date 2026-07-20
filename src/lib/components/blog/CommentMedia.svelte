<script lang="ts">
	import type { FediverseAttachment } from "$lib/fediverse/types";
	import { MediaGrid } from "@cofob/design-system-svelte";

	let { attachments }: { attachments: FediverseAttachment[] } = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

{#if attachments.length > 0}
	<MediaGrid aria-label="Comment attachments">
		{#each attachments as attachment (attachment.url)}
			<li>
				{#if !attachment.description}
					<a class="cf-link" href={attachment.url} target="_blank" rel="nofollow noopener noreferrer"
						>View undescribed attachment</a
					>
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
					<a class="cf-link" href={attachment.url} target="_blank" rel="nofollow noopener noreferrer"
						>{attachment.description}</a
					>
				{/if}
			</li>
		{/each}
	</MediaGrid>
{/if}
