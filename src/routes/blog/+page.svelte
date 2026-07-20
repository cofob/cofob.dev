<script lang="ts">
	import { browser } from "$app/environment";
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { siteSocialImage } from "$lib/blog/catalog";
	import { toPostModel } from "$lib/blog/post-model";
	import type { SearchPost } from "$lib/blog/types";
	import {
		BlueLine,
		Card,
		Container,
		EmptyState,
		Heading,
		Inline,
		Link,
		Meta,
		Pagination,
		SearchResultCard,
		Section,
		Stack,
		Tag,
		Text,
		TextField,
	} from "$lib/components";
	import PostCard from "$lib/components/blog/PostCard.svelte";
	import { blogStructuredData } from "$lib/seo/structured-data";
	import { onMount } from "svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let query = $state("");
	let searchIndex = $state<SearchPost[] | undefined>();
	let searchLoading = $state(false);
	let searchError = $state(false);
	let normalizedQuery = $derived(query.trim().toLocaleLowerCase());
	let searching = $derived(normalizedQuery.length > 0);
	let selectedTag = $derived.by(() => {
		const requested =
			data.clientSideFiltering && browser ? (page.url.searchParams.get("tag")?.trim() ?? "") : data.selectedTag;
		return data.tags.find((tag) => tag.toLocaleLowerCase() === requested.toLocaleLowerCase()) ?? requested;
	});
	let requestedPage = $derived.by(() => {
		if (!data.clientSideFiltering || !browser) return data.page;
		const value = page.url.searchParams.get("page");
		return value && /^\d+$/.test(value) ? Math.max(1, Number.parseInt(value, 10)) : 1;
	});
	let clientFilteredPosts = $derived(
		(searchIndex ?? []).filter(
			(post) => !selectedTag || post.tags.some((tag) => tag.toLocaleLowerCase() === selectedTag.toLocaleLowerCase()),
		),
	);
	let clientPageCount = $derived(Math.max(1, Math.ceil(clientFilteredPosts.length / 10)));
	let clientPage = $derived(Math.min(requestedPage, clientPageCount));
	let listedPosts = $derived(
		data.clientSideFiltering && searchIndex
			? clientFilteredPosts.slice((clientPage - 1) * 10, clientPage * 10)
			: data.posts,
	);
	let listedTotal = $derived(data.clientSideFiltering && searchIndex ? clientFilteredPosts.length : data.total);
	let listedPage = $derived(data.clientSideFiltering && searchIndex ? clientPage : data.page);
	let listedPageCount = $derived(data.clientSideFiltering && searchIndex ? clientPageCount : data.pageCount);
	let searchResults = $derived(
		(searchIndex ?? []).filter((post) => {
			if (selectedTag && !post.tags.some((tag) => tag.toLocaleLowerCase() === selectedTag.toLocaleLowerCase())) {
				return false;
			}
			return [post.title, post.description, ...post.tags].some((value) =>
				value.toLocaleLowerCase().includes(normalizedQuery),
			);
		}),
	);

	function blogHref(page = 1, tag = selectedTag): string {
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

	onMount(() => {
		if (data.clientSideFiltering) void loadSearchIndex();
	});
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- dynamic query links are based on resolved routes -->
<Meta
	title="Blog"
	description="Writing and notes from cofob."
	url="/blog/"
	structuredData={blogStructuredData(data.posts, siteSocialImage)}
/>

<Container size="wide">
	<Section>
		<Stack gap="xl">
			<header>
				<Stack align="center" gap="sm">
					<Heading level={1} size="2xl"><BlueLine>Blog</BlueLine></Heading>
					<Text size="lg" tone="muted">Writing and notes from cofob.</Text>
					<nav aria-label="Blog feeds">
						<Inline gap="sm" justify="center">
							<Link href={resolve("/rss.xml")}>RSS</Link>
							<Link href={resolve("/atom.xml")}>Atom</Link>
						</Inline>
					</nav>
				</Stack>
			</header>

			<Card variant="outlined" padding="lg">
				<Stack gap="md">
					<TextField
						id="blog-search"
						type="search"
						label="Search posts"
						placeholder="Title, description, or tag"
						bind:value={query}
						oninput={handleSearch}
						autocomplete="off"
					/>

					{#if data.tags.length > 0}
						<nav aria-label="Filter posts by tag">
							<Inline gap="sm">
								<a
									class="cf-link"
									data-underline="none"
									href={blogHref(1, "")}
									aria-current={!selectedTag ? "page" : undefined}
								>
									<Tag tone={!selectedTag ? "accent" : "neutral"}>All</Tag>
								</a>
								{#each data.tags as tag (tag)}
									<a
										class="cf-link"
										data-underline="none"
										href={blogHref(1, tag)}
										aria-current={selectedTag === tag ? "page" : undefined}
									>
										<Tag tone={selectedTag === tag ? "accent" : "neutral"}>{tag}</Tag>
									</a>
								{/each}
							</Inline>
						</nav>
					{/if}
				</Stack>
			</Card>

			{#if searching}
				<Text size="sm" tone="muted" aria-live="polite">
					{#if searchLoading}
						Loading search index…
					{:else if searchError}
						Search could not be loaded.
					{:else}
						{searchResults.length} {searchResults.length === 1 ? "result" : "results"}
					{/if}
				</Text>

				{#if !searchLoading && !searchError}
					<Stack gap="md">
						{#each searchResults as post (post.slug)}
							<SearchResultCard
								result={toPostModel(post, resolve("/blog/[slug]", { slug: post.slug }))}
								{query}
								headingLevel={2}
							/>
						{/each}
					</Stack>
				{/if}
			{:else if listedPosts.length > 0}
				<Text size="sm" tone="muted">Showing {listedPosts.length} of {listedTotal} posts</Text>
				<Stack gap="lg">
					{#each listedPosts as post (post.slug)}
						<PostCard {post} />
					{/each}
				</Stack>

				{#if listedPageCount > 1}
					<Pagination
						page={listedPage}
						totalPages={listedPageCount}
						getHref={(page) => blogHref(page)}
						label="Blog pages"
					/>
				{/if}
			{:else}
				<EmptyState
					title="No posts"
					description={selectedTag ? `No posts tagged “${selectedTag}”.` : "No posts have been published yet."}
				/>
			{/if}
		</Stack>
	</Section>
</Container>
