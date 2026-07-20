<script lang="ts">
	import { resolve } from "$app/paths";
	import { Alert, Container, Heading, Link, Section, Stack } from "@cofob/design-system-svelte";
	import AsciinemaPlayer from "$lib/components/blog/AsciinemaPlayer.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Terminal recording — cofob.dev</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<Container size="wide">
	<Section>
		<article>
			<Stack gap="lg">
				<Link href={resolve("/blog")}>← All posts</Link>
				<Heading level={1} size="2xl">Terminal recording</Heading>
				{#if data.source}
					<AsciinemaPlayer src={data.source} label="Terminal recording" directFallback />
				{:else}
					<Alert title="Recording unavailable" tone="danger">{data.error}</Alert>
				{/if}
			</Stack>
		</article>
	</Section>
</Container>
