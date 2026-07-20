<script lang="ts">
	import { resolve } from "$app/paths";
	import { toPostModel, type PostModelSource } from "$lib/blog/post-model";
	import { PostCard as DesignSystemPostCard } from "@cofob/design-system-svelte";

	let {
		post,
		latest = false,
		headingLevel = 2,
	}: { post: PostModelSource; latest?: boolean; headingLevel?: 2 | 3 | 4 } = $props();
	let model = $derived(toPostModel(post, resolve("/blog/[slug]", { slug: post.slug })));
</script>

<DesignSystemPostCard post={model} {headingLevel} data-latest={latest || undefined} />
