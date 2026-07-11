<script lang="ts">
	import { resolve } from "$app/paths";
	import { siteSocialImage } from "$lib/blog/catalog";
	import { formatPostDate } from "$lib/blog/format";
	import { getPostComponent } from "$lib/blog/components";
	import { Meta } from "$lib/components";
	import Comments from "$lib/components/blog/Comments.svelte";
	import ResponsiveImage from "$lib/components/blog/ResponsiveImage.svelte";
	import { postStructuredData } from "$lib/seo/structured-data";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
	let Post = $derived(getPostComponent(data.post.slug));
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -- tag links append a query to the resolved blog route -->
<Meta
	title={data.post.title}
	description={data.post.description}
	image={data.post.socialImage ?? siteSocialImage}
	url={resolve("/blog/[slug]", { slug: data.post.slug })}
	type="article"
	lang={data.post.lang}
	published={data.post.published}
	updated={data.post.updated}
	structuredData={postStructuredData(data.post, siteSocialImage)}
/>

<article class="article" lang={data.post.lang}>
	{#if !data.post.isPublic}
		<p class="preview-banner" role="status">
			Development preview: this post is {data.post.draft ? "a draft" : "scheduled"}.
		</p>
	{/if}

	<header class="article-header">
		<p class="back"><a href={resolve("/blog")}>← All posts</a></p>
		<h1>{data.post.title}</h1>
		<p class="description">{data.post.description}</p>
		<p class="dates">
			Published <time datetime={data.post.published}>{formatPostDate(data.post.published, data.post.lang)}</time>
			{#if data.post.updated}
				<span aria-hidden="true"> · </span>
				<span
					>Updated <time datetime={data.post.updated}>{formatPostDate(data.post.updated, data.post.lang)}</time></span
				>
			{/if}
		</p>
		{#if data.post.tags.length > 0}
			<nav class="tags" aria-label="Post tags">
				{#each data.post.tags as tag (tag)}
					<a href={`${resolve("/blog")}?tag=${encodeURIComponent(tag)}`}>{tag}</a>
				{/each}
			</nav>
		{/if}
	</header>

	{#if data.post.cover}
		<div class="cover"><ResponsiveImage image={data.post.cover} loading="eager" fetchpriority="high" /></div>
	{/if}

	<div class="blog-prose">
		<Post />
	</div>

	{#if data.post.comments}
		<Comments source={data.post.comments} lang={data.post.lang} mode={data.commentMode} initial={data.comments} />
	{/if}
</article>

<style lang="postcss">
	@reference "../../../lib/app.css";

	.article {
		@apply mx-auto my-10 max-w-5xl px-4 sm:my-16;
	}

	.preview-banner {
		@apply mb-6 rounded-lg border-2 border-sky-300 bg-sky-50 p-3 font-semibold;
	}

	.article-header {
		@apply mb-8;
	}

	.back {
		@apply mb-5;
	}

	.back a {
		@apply text-sky-700 hover:underline;
	}

	h1 {
		@apply text-4xl font-semibold leading-tight sm:text-6xl;
	}

	.description {
		@apply mt-4 text-xl text-zinc-600;
	}

	.dates {
		@apply mt-4 text-sm text-zinc-600;
	}

	.tags {
		@apply mt-3 flex flex-wrap gap-2;
	}

	.tags a {
		@apply rounded-full bg-zinc-100 px-2.5 py-1 text-sm text-zinc-600 hover:bg-zinc-200;
	}

	.cover :global(img) {
		@apply mb-8 max-h-[32rem] w-full rounded-xl object-cover;
	}

	.blog-prose {
		@apply text-lg leading-8;
	}

	.blog-prose :global(h2) {
		@apply mt-10 mb-4 text-3xl font-semibold leading-tight;
	}

	.blog-prose :global(h3) {
		@apply mt-8 mb-3 text-2xl font-semibold;
	}

	.blog-prose :global(h4) {
		@apply mt-6 mb-2 text-xl font-semibold;
	}

	.blog-prose :global(p) {
		@apply my-4;
	}

	.blog-prose :global(a) {
		@apply text-sky-700 underline underline-offset-2;
	}

	.blog-prose :global(ul) {
		@apply my-4 ml-6 list-disc;
	}

	.blog-prose :global(ol) {
		@apply my-4 ml-6 list-decimal;
	}

	.blog-prose :global(blockquote) {
		@apply my-6 border-l-4 border-sky-300 pl-4 text-zinc-600;
	}

	.blog-prose :global(pre) {
		@apply my-6 overflow-x-auto rounded-xl bg-zinc-800 p-4 text-base text-zinc-100;
	}

	.blog-prose :global(:not(pre) > code) {
		@apply rounded bg-zinc-100 px-1 py-0.5 text-base;
	}

	.blog-prose :global(table) {
		@apply my-6 block max-w-full overflow-x-auto border-collapse;
	}

	.blog-prose :global(th),
	.blog-prose :global(td) {
		@apply border border-zinc-500 px-3 py-2 text-left;
	}

	.blog-prose :global(img),
	.blog-prose :global(video) {
		@apply my-6 h-auto max-w-full rounded-lg;
	}

	.blog-prose :global(hr) {
		@apply my-10 border-zinc-100;
	}
</style>
