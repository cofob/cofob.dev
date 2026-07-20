<script lang="ts">
	import { Link, Stack, Sticker, Text } from "@cofob/design-system-svelte";

	let { src, alt, sourceName, sourceUrl }: { src: string; alt: string; sourceName: string; sourceUrl: string } =
		$props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<figure>
	<Stack align="center" gap="xs">
		<Sticker data-image="true"><img {src} {alt} width="192" height="192" loading="lazy" decoding="async" /></Sticker>
		<figcaption>
			<Text as="span" size="sm" tone="muted">
				Источник: <Link href={sourceUrl} external rel="noopener noreferrer">{sourceName}</Link>
			</Text>
		</figcaption>
	</Stack>
</figure>
