<script lang="ts">
	import { resolve } from "$app/paths";
	import { siteSocialImage } from "$lib/blog/catalog";
	import { formatPostDate } from "$lib/blog/format";
	import type { SearchPost } from "$lib/blog/types";
	import { BlueLine, Heading, Meta, Section } from "$lib/components";
	import PostCard from "$lib/components/blog/PostCard.svelte";
	import { blogStructuredData } from "$lib/seo/structured-data";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let query = $state("");
	let searchIndex = $state<SearchPost[] | undefined>();
	let searchLoading = $state(false);
	let searchError = $state(false);
	let normalizedQuery = $derived(query.trim().toLocaleLowerCase());
	let searching = $derived(normalizedQuery.length > 0);
	let searchResults = $derived(
		(searchIndex ?? []).filter((post) => {
			if (
				data.selectedTag &&
				!post.tags.some((tag) => tag.toLocaleLowerCase() === data.selectedTag.toLocaleLowerCase())
			) {
				return false;
			}
			return [post.title, post.description, ...post.tags].some((value) =>
				value.toLocaleLowerCase().includes(normalizedQuery),
			);
		}),
	);

	function blogHref(page = 1, tag = data.selectedTag): string {
		const parameters = [];
		if (tag) parameters.push(`tag=${encodeURIComponent(tag)}`);
		if (page > 1) parameters.push(`page=${page}`);
		const search = parameters.join("&");
		return `${resolve("/blog")}${search ? `?${search}` : ""}`;
	}

	async function loadSearchIndex() {
		if (searchIndex || searchLoading) return;
		searchLoading = true;
		searchError = false;
		try {
			const response = await fetch(resolve("/blog/search.json"));
			if (!response.ok) throw new Error(`Search index returned ${response.status}`);
			searchIndex = (await response.json()) as SearchPost[];
		} catch {
			searchError = true;
		} finally {
			searchLoading = false;
		}
	}

	function handleSearch(event: Event) {
		query = (event.currentTarget as HTMLInputElement).value;
		if (query.trim()) void loadSearchIndex();
	}
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- dynamic query links are based on resolved routes -->
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

	<div class="controls">
		<label for="blog-search">Search posts</label>
		<input
			id="blog-search"
			type="search"
			placeholder="Title, description, or tag"
			value={query}
			oninput={handleSearch}
			autocomplete="off"
		/>

		{#if data.tags.length > 0}
			<nav class="tag-filters" aria-label="Filter posts by tag">
				<a href={blogHref(1, "")} aria-current={!data.selectedTag ? "page" : undefined}>All</a>
				{#each data.tags as tag (tag)}
					<a href={blogHref(1, tag)} aria-current={data.selectedTag === tag ? "page" : undefined}>{tag}</a>
				{/each}
			</nav>
		{/if}
	</div>

	{#if searching}
		<p class="result-count" aria-live="polite">
			{#if searchLoading}
				Loading search index…
			{:else if searchError}
				Search could not be loaded.
			{:else}
				{searchResults.length} {searchResults.length === 1 ? "result" : "results"}
			{/if}
		</p>

		{#if !searchLoading && !searchError}
			<div class="search-results">
				{#each searchResults as post (post.slug)}
					<a class="search-result" href={resolve("/blog/[slug]", { slug: post.slug })}>
						<span class="search-date">{formatPostDate(post.published, post.lang)}</span>
						<strong>{post.title}</strong>
						<span>{post.description}</span>
						{#if post.tags.length > 0}<small>{post.tags.join(" · ")}</small>{/if}
					</a>
				{/each}
			</div>
		{/if}
	{:else}
		{#if data.posts.length > 0}
			<p class="result-count">Showing {data.posts.length} of {data.total} posts</p>
			<div class="post-list">
				{#each data.posts as post (post.slug)}
					<PostCard {post} />
				{/each}
			</div>

			{#if data.pageCount > 1}
				<nav class="pagination" aria-label="Blog pages">
					{#if data.page > 1}<a href={blogHref(data.page - 1)} rel="prev">Previous</a>{/if}
					{#each Array.from({ length: data.pageCount }, (_, index) => index + 1) as page (page)}
						<a href={blogHref(page)} aria-current={page === data.page ? "page" : undefined}>{page}</a>
					{/each}
					{#if data.page < data.pageCount}<a href={blogHref(data.page + 1)} rel="next">Next</a>{/if}
				</nav>
			{/if}
		{:else}
			<p class="empty-state">
				{data.selectedTag ? `No posts tagged “${data.selectedTag}”.` : "No posts have been published yet."}
			</p>
		{/if}
	{/if}
</Section>

<style lang="postcss">
	@reference "../../lib/app.css";

	.page-header {
		@apply mb-8 text-center;
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

	.controls {
		@apply mx-auto mb-7 max-w-4xl;
	}

	.controls > label {
		@apply mb-1 block text-sm font-semibold;
	}

	.controls > input {
		@apply w-full rounded-lg border-2 border-zinc-100 px-3 py-2;
	}

	.tag-filters {
		@apply mt-3 flex flex-wrap gap-2;
	}

	.tag-filters a {
		@apply rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-zinc-600 hover:bg-zinc-200;
	}

	.tag-filters a[aria-current="page"] {
		@apply bg-zinc-800 text-white;
	}

	.result-count {
		@apply mx-auto mb-3 max-w-4xl text-sm text-zinc-600;
	}

	.post-list,
	.search-results {
		@apply mx-auto grid max-w-4xl gap-5;
	}

	.search-result {
		@apply grid rounded-xl border-2 border-zinc-100 p-4 hover:bg-zinc-100;
	}

	.search-result strong {
		@apply text-xl;
	}

	.search-result > span:not(.search-date) {
		@apply text-zinc-600;
	}

	.search-result small,
	.search-date {
		@apply text-sm text-zinc-600;
	}

	.pagination {
		@apply mx-auto mt-7 flex max-w-4xl flex-wrap justify-center gap-2;
	}

	.pagination a {
		@apply min-w-9 rounded-lg bg-zinc-100 px-3 py-2 text-center text-sm hover:bg-zinc-200;
	}

	.pagination a[aria-current="page"] {
		@apply bg-zinc-800 text-white;
	}

	.empty-state {
		@apply mx-auto max-w-xl rounded-xl bg-zinc-100 p-6 text-center;
	}
</style>
