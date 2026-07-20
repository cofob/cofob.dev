<script lang="ts">
	import type { FediverseComment } from "$lib/fediverse/types";
	import { Avatar, Inline, Link, Stack, Text } from "@cofob/design-system-svelte";
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
	<ol class="cf-stack" data-gap="sm">
		{#each items as comment (comment.id)}
			<li>
				<article class="cf-card" data-padding="md" data-variant="outlined">
					<Stack gap="sm">
						<header>
							<Inline gap="sm" align="start" wrap={false}>
								<Avatar
									name={comment.author.name}
									image={comment.author.avatar ? { src: comment.author.avatar, alt: "" } : undefined}
									alt=""
								/>
								<Stack gap="xs">
									<Link href={comment.author.url} external rel="nofollow noopener noreferrer">
										<strong>{comment.author.name}</strong> <span>@{comment.author.acct}</span>
									</Link>
									<Link href={comment.url} external rel="nofollow noopener noreferrer">
										<Text as="span" size="sm" tone="muted">
											<time datetime={comment.createdAt}>{formatCommentDate(comment.createdAt)} UTC</time>
										</Text>
									</Link>
								</Stack>
							</Inline>
						</header>

						{#if comment.contentWarning || comment.sensitive}
							<details>
								<summary class="cf-button" data-variant="ghost">{comment.contentWarning ?? "Sensitive content"}</summary
								>
								<RichText nodes={comment.content} />
								<CommentMedia attachments={comment.attachments} />
							</details>
						{:else}
							<RichText nodes={comment.content} />
							<CommentMedia attachments={comment.attachments} />
						{/if}
					</Stack>
				</article>

				{#if comment.replies.length > 0}
					<div class="cf-section" data-spacing="sm">{@render renderComments(comment.replies)}</div>
				{/if}
			</li>
		{/each}
	</ol>
{/snippet}

{@render renderComments(comments)}
