<script lang="ts">
	import { resolve } from "$app/paths";
	import { siteSocialImage } from "$lib/blog/catalog";
	import { formatPostDate } from "$lib/blog/format";
	import { getPostComponent } from "$lib/blog/components";
	import {
		Alert,
		Container,
		Heading,
		Inline,
		Link,
		Meta,
		Prose,
		ResponsiveImage,
		Section,
		Stack,
		Tag,
		Text,
	} from "$lib/components";
	import Comments from "$lib/components/blog/Comments.svelte";
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

<Container size="wide">
	<Section>
		<article lang={data.post.lang}>
			<Stack gap="xl">
				{#if !data.post.isPublic}
					<Alert title="Development preview" tone="info">
						This post is {data.post.draft ? "a draft" : "scheduled"}.
					</Alert>
				{/if}

				<header>
					<Stack gap="md">
						<Link href={resolve("/blog")} underline="hover">← All posts</Link>
						<Heading level={1} size="2xl">{data.post.title}</Heading>
						<Text size="lg" tone="muted">{data.post.description}</Text>
						<Inline gap="sm" align="baseline">
							<Text as="span" size="sm" tone="muted">
								Published <time datetime={data.post.published}
									>{formatPostDate(data.post.published, data.post.lang)}</time
								>
							</Text>
							{#if data.post.updated}
								<Text as="span" size="sm" tone="muted">
									Updated <time datetime={data.post.updated}>{formatPostDate(data.post.updated, data.post.lang)}</time>
								</Text>
							{/if}
						</Inline>
						{#if data.post.tags.length > 0}
							<nav aria-label="Post tags">
								<Inline gap="sm">
									{#each data.post.tags as tag (tag)}
										<a
											class="cf-link"
											data-underline="none"
											href={`${resolve("/blog")}?tag=${encodeURIComponent(tag)}`}
										>
											<Tag>{tag}</Tag>
										</a>
									{/each}
								</Inline>
							</nav>
						{/if}
					</Stack>
				</header>

				{#if data.post.cover}
					<ResponsiveImage
						image={{ ...data.post.cover, sizes: "(min-width: 800px) 1024px, calc(100vw - 2rem)" }}
						priority
						fit="cover"
					/>
				{/if}

				<Prose size="default">
					<Post />
				</Prose>

				{#if data.post.comments}
					<Comments source={data.post.comments} lang={data.post.lang} mode={data.commentMode} initial={data.comments} />
				{/if}
			</Stack>
		</article>
	</Section>
</Container>
