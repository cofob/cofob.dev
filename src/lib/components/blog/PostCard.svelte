<script lang="ts">
	import { resolve } from "$app/paths";
	import { formatPostDate } from "$lib/blog/format";
	import type { PostSummary } from "$lib/blog/types";
	import ResponsiveImage from "./ResponsiveImage.svelte";

	let { post, latest = false }: { post: PostSummary; latest?: boolean } = $props();
</script>

<article class:latest>
	{#if post.cover}
		<a class="cover-link" href={resolve("/blog/[slug]", { slug: post.slug })} aria-hidden="true" tabindex="-1">
			<ResponsiveImage
				image={post.cover}
				alt=""
				sizes="(min-width: 640px) 320px, calc(100vw - 2rem)"
				loading={latest ? "eager" : "lazy"}
				fetchpriority={latest ? "high" : "auto"}
			/>
		</a>
	{/if}
	<div class="content">
		<p class="date">
			Published <time datetime={post.published}>{formatPostDate(post.published, post.lang)}</time>
			{#if post.updated}
				<span aria-hidden="true"> · </span>
				<span>Updated <time datetime={post.updated}>{formatPostDate(post.updated, post.lang)}</time></span>
			{/if}
		</p>
		<h3><a href={resolve("/blog/[slug]", { slug: post.slug })}>{post.title}</a></h3>
		<p>{post.description}</p>
		<a class="read-link" href={resolve("/blog/[slug]", { slug: post.slug })}
			>Read post <span aria-hidden="true">→</span></a
		>
	</div>
</article>

<style lang="postcss">
	@reference "../../app.css";

	article {
		@apply overflow-hidden rounded-xl border-2 border-zinc-100 bg-white sm:flex;
	}

	article.latest {
		@apply border-sky-300 bg-sky-50;
	}

	.cover-link {
		@apply block sm:w-2/5;
	}

	.cover-link :global(img) {
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

	h3 a:hover,
	h3 a:focus-visible {
		@apply underline decoration-sky-300 decoration-4 underline-offset-4;
	}

	.read-link {
		@apply mt-3 inline-block font-semibold text-sky-700 hover:underline;
	}
</style>
