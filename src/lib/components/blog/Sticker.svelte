<script lang="ts">
	import { Link, Stack, Text } from "@cofob/design-system-svelte";
	import type { Component } from "svelte";

	type StickerComponent = Component<{
		alt: string;
		rotation?: -6 | -3 | 0 | 3 | 6;
	}>;

	let {
		sticker: StickerComponent,
		alt,
		rotation = -3,
		sourceName,
		sourceUrl,
	}: {
		sticker: StickerComponent;
		alt: string;
		rotation?: -6 | -3 | 0 | 3 | 6;
		sourceName: string;
		sourceUrl: string;
	} = $props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<figure>
	<Stack align="center" gap="xs">
		<StickerComponent {alt} {rotation} />
		<figcaption>
			<Text as="span" size="sm" tone="muted">
				Источник: <Link href={sourceUrl} external rel="noopener noreferrer">{sourceName}</Link>
			</Text>
		</figcaption>
	</Stack>
</figure>
