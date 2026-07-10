<script lang="ts">
	import type { FediverseComment } from "$lib/fediverse/types";
	import CommentMedia from "./CommentMedia.svelte";
	import RichText from "./RichText.svelte";

	let { comments, lang }: { comments: FediverseComment[]; lang: string } = $props();

	function formatCommentDate(value: string) {
		return new Intl.DateTimeFormat(lang, {
			dateStyle: "medium",
			timeStyle: "short",
			timeZone: "UTC",
		}).format(new Date(value));
	}
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->

{#snippet renderComments(items: FediverseComment[])}
	<ol class="comment-list">
		{#each items as comment (comment.id)}
			<li>
				<article class="comment">
					<header>
						{#if comment.author.avatar}
							<img
								class="avatar"
								src={comment.author.avatar}
								alt=""
								width="44"
								height="44"
								loading="lazy"
								decoding="async"
								referrerpolicy="no-referrer"
							/>
						{/if}
						<div class="author">
							<a href={comment.author.url} target="_blank" rel="nofollow noopener noreferrer">
								<strong>{comment.author.name}</strong>
								<span>@{comment.author.acct}</span>
							</a>
							<a class="date" href={comment.url} target="_blank" rel="nofollow noopener noreferrer">
								<time datetime={comment.createdAt}>{formatCommentDate(comment.createdAt)} UTC</time>
							</a>
						</div>
					</header>

					{#if comment.contentWarning || comment.sensitive}
						<details class="content-warning">
							<summary>{comment.contentWarning ?? "Sensitive content"}</summary>
							<RichText nodes={comment.content} />
							<CommentMedia attachments={comment.attachments} />
						</details>
					{:else}
						<RichText nodes={comment.content} />
						<CommentMedia attachments={comment.attachments} />
					{/if}
				</article>

				{#if comment.replies.length > 0}
					<div class="replies">{@render renderComments(comment.replies)}</div>
				{/if}
			</li>
		{/each}
	</ol>
{/snippet}

{@render renderComments(comments)}

<style lang="postcss">
	@reference "../../app.css";

	.comment-list {
		@apply space-y-3;
	}

	.comment {
		@apply rounded-lg border-2 border-zinc-100 p-3;
	}

	header {
		@apply mb-3 flex gap-3;
	}

	.avatar {
		@apply shrink-0 rounded-full bg-zinc-100;
	}

	.author {
		@apply min-w-0 text-sm;
	}

	.author > a:first-child {
		@apply flex flex-wrap items-baseline gap-x-2;
	}

	.author span,
	.date {
		@apply text-zinc-600;
	}

	a:hover {
		@apply underline;
	}

	.content-warning summary {
		@apply mb-2 cursor-pointer font-semibold;
	}

	.replies {
		@apply mt-3 ml-3 border-l-2 border-sky-200 pl-3 sm:ml-6 sm:pl-4;
	}
</style>
