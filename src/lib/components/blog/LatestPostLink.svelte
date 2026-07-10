<script lang="ts">
	import { resolve } from "$app/paths";
	import { formatPostDate } from "$lib/blog/format";
	import type { PostSummary } from "$lib/blog/types";

	let { post }: { post: PostSummary } = $props();
</script>

<a class="latest-post" href={resolve("/blog/[slug]", { slug: post.slug })}>
	<span class="meta">
		<span class="label">Latest post</span>
		<time datetime={post.published}>{formatPostDate(post.published, post.lang)}</time>
	</span>
	<strong class="title">{post.title}</strong>
	<span class="description">{post.description}</span>
	<span class="arrow" aria-hidden="true">→</span>
</a>

<style lang="postcss">
	@reference "../../app.css";

	.latest-post {
		@apply mx-auto grid max-w-2xl min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-x-4 gap-y-1 rounded-lg border border-zinc-200 bg-zinc-100 px-4 py-3 transition-colors hover:bg-zinc-200;
		grid-template-areas:
			"meta arrow"
			"title arrow"
			"description arrow";
	}

	.meta {
		@apply flex min-w-0 flex-wrap items-center gap-x-2 text-xs text-zinc-600;
		grid-area: meta;
	}

	.label {
		@apply text-xs font-semibold tracking-wide text-zinc-600 uppercase;
	}

	.title {
		@apply min-w-0 text-base leading-5 font-semibold text-zinc-800;
		grid-area: title;
	}

	.description {
		@apply min-w-0 line-clamp-2 text-sm leading-5 text-zinc-600;
		grid-area: description;
	}

	.arrow {
		@apply self-center text-zinc-600;
		grid-area: arrow;
	}

	.latest-post:focus-visible {
		@apply bg-zinc-200;
	}
</style>
