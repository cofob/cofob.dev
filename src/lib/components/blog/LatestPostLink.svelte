<script lang="ts">
	import { resolve } from "$app/paths";
	import { toPostModel } from "$lib/blog/post-model";
	import type { PostSummary } from "$lib/blog/types";
	import { LatestPostCard } from "@cofob/design-system-svelte";

	let { post }: { post: PostSummary } = $props();
	let model = $derived(toPostModel(post, resolve("/blog/[slug]", { slug: post.slug })));
</script>

<LatestPostCard post={model} headingLevel={2} />
