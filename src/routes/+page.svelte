<script lang="ts">
	import { resolve } from "$app/paths";
	import { siteSocialImage } from "$lib/blog/catalog";
	import { Meta, BlueLine, Section, Heading } from "$lib/components";
	import LatestPostLink from "$lib/components/blog/LatestPostLink.svelte";
	import { homeStructuredData } from "$lib/seo/structured-data";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<Meta
	title="Home"
	description="cofob's personal website"
	url="/"
	structuredData={homeStructuredData(siteSocialImage)}
/>

<Section>
	<div class="text-center py-20 sm:py-32">
		<Heading level={1}>
			Hi! I'm <BlueLine animate>cofob</BlueLine>.
		</Heading>
		<p>Python developer.</p>
	</div>
</Section>

{#if data.latestPost}
	<Section>
		<div class="latest">
			<LatestPostLink post={data.latestPost} />
			<a class="all-posts" href={resolve("/blog")}>All posts</a>
		</div>
	</Section>
{/if}

<style lang="postcss">
	@reference "../lib/app.css";

	.latest {
		@apply mx-auto max-w-2xl;
	}

	.all-posts {
		@apply mt-2 block text-right text-xs text-zinc-600 hover:underline;
	}
</style>
