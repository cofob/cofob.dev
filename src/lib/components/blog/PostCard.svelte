<script lang="ts">
	import { resolve } from "$app/paths";
	import { formatPostDate } from "$lib/blog/format";
	import type { PostSummary } from "$lib/blog/types";
	import ResponsiveImage from "./ResponsiveImage.svelte";

	let { post, latest = false }: { post: PostSummary; latest?: boolean } = $props();
</script>

<a class="card-link" href={resolve("/blog/[slug]", { slug: post.slug })}>
	<article class:latest>
		{#if post.cover}
			<div class="cover">
				<ResponsiveImage
					image={post.cover}
					alt=""
					sizes="(min-width: 640px) 320px, calc(100vw - 2rem)"
					loading={latest ? "eager" : "lazy"}
					fetchpriority={latest ? "high" : "auto"}
				/>
			</div>
		{/if}
		<div class="content">
			<p class="date">
				Published <time datetime={post.published}>{formatPostDate(post.published, post.lang)}</time>
				{#if post.updated}
					<span aria-hidden="true"> · </span>
					<span>Updated <time datetime={post.updated}>{formatPostDate(post.updated, post.lang)}</time></span>
				{/if}
			</p>
			<h3>{post.title}</h3>
			<p>{post.description}</p>
			{#if post.tags.length > 0}
				<ul class="tags" aria-label="Tags">
					{#each post.tags as tag (tag)}
						<li>{tag}</li>
					{/each}
				</ul>
			{/if}
			<span class="read-link">Read post <span aria-hidden="true">→</span></span>
		</div>
	</article>
</a>

<style lang="postcss">
	@reference "../../app.css";

	.card-link {
		@apply block rounded-xl;
	}

	article {
		@apply overflow-hidden rounded-xl border-2 border-zinc-100 bg-white transition-colors sm:flex;
	}

	.card-link:hover article,
	.card-link:focus-visible article {
		@apply border-zinc-200 bg-zinc-100;
	}

	article.latest {
		@apply border-sky-300 bg-sky-50;
	}

	.cover {
		@apply block sm:w-2/5;
	}

	.cover :global(img) {
		@apply h-48 w-full object-cover sm:h-full;
	}

	.content {
		@apply p-5;
	}

	.date {
		@apply mb-1 text-sm text-zinc-600;
	}

	h3 {
		@apply text-2xl font-semibold;
	}

	.card-link:hover h3,
	.card-link:focus-visible h3 {
		@apply underline decoration-sky-300 decoration-4 underline-offset-4;
	}

	.read-link {
		@apply mt-3 inline-block font-semibold text-sky-700 hover:underline;
	}

	.tags {
		@apply mt-3 flex flex-wrap gap-1.5;
	}

	.tags li {
		@apply rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600;
	}

	.card-link:hover .tags li,
	.card-link:focus-visible .tags li {
		@apply bg-white;
	}
</style>
