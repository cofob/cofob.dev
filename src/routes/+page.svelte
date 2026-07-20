<script lang="ts">
	import { resolve } from "$app/paths";
	import { siteSocialImage } from "$lib/blog/catalog";
	import { Meta, BlueLine, Container, Heading, Link, Section, Stack, Text } from "$lib/components";
	import LatestPostLink from "$lib/components/blog/LatestPostLink.svelte";
	import { homeStructuredData } from "$lib/seo/structured-data";
	import { lineRainbowStore } from "$lib/store";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<Meta
	title="Home"
	description="cofob's personal website"
	url="/"
	structuredData={homeStructuredData(siteSocialImage)}
/>

<Container>
	<Section data-spacing="lg">
		<Stack align="center" gap="sm">
			<Heading level={1} size="2xl">
				Hi! I'm <BlueLine animate rainbow={$lineRainbowStore}>cofob</BlueLine>.
			</Heading>
			<Text size="lg" tone="muted">Python developer.</Text>
		</Stack>
	</Section>

	{#if data.latestPost}
		<Section>
			<Stack gap="sm">
				<LatestPostLink post={data.latestPost} />
				<Link href={resolve("/blog")} underline="hover">All posts</Link>
			</Stack>
		</Section>
	{/if}
</Container>
