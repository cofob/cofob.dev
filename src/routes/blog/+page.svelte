<script lang="ts">
	import { resolve } from "$app/paths";
	import { siteSocialImage } from "$lib/blog/catalog";
	import { BlueLine, Heading, Meta, Section } from "$lib/components";
	import PostCard from "$lib/components/blog/PostCard.svelte";
	import { blogStructuredData } from "$lib/seo/structured-data";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<Meta
	title="Blog"
	description="Writing and notes from cofob."
	url="/blog/"
	structuredData={blogStructuredData(data.posts, siteSocialImage)}
/>

<Section>
	<header class="page-header">
		<Heading level={1}><BlueLine>Blog</BlueLine></Heading>
		<p>Writing and notes from cofob.</p>
		<nav aria-label="Blog feeds">
			<a href={resolve("/rss.xml")}>RSS</a>
			<span aria-hidden="true">·</span>
			<a href={resolve("/atom.xml")}>Atom</a>
		</nav>
	</header>

	{#if data.posts.length > 0}
		<div class="post-list">
			{#each data.posts as post (post.slug)}
				<PostCard {post} />
			{/each}
		</div>
	{:else}
		<p class="empty-state">No posts have been published yet. Subscribe to a feed to catch the first one.</p>
	{/if}
</Section>

<style lang="postcss">
	@reference "../../lib/app.css";

	.page-header {
		@apply mb-10 text-center;
	}

	.page-header p {
		@apply text-lg text-zinc-600;
	}

	.page-header nav {
		@apply mt-3 flex justify-center gap-2;
	}

	.page-header a {
		@apply text-sky-700 hover:underline;
	}

	.post-list {
		@apply mx-auto grid max-w-3xl gap-5;
	}

	.empty-state {
		@apply mx-auto max-w-xl rounded-xl bg-zinc-100 p-6 text-center;
	}
</style>
