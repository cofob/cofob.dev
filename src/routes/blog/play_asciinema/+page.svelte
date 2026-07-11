<script lang="ts">
	import { resolve } from "$app/paths";
	import AsciinemaPlayer from "$lib/components/blog/AsciinemaPlayer.svelte";
	import type { PageData } from "./$types";

	let { data }: { data: PageData } = $props();
</script>

<svelte:head>
	<title>Terminal recording — cofob.dev</title>
	<meta name="robots" content="noindex" />
</svelte:head>

<article>
	<p><a href={resolve("/blog")}>← All posts</a></p>
	<h1>Terminal recording</h1>
	{#if data.source}
		<AsciinemaPlayer src={data.source} label="Terminal recording" />
	{:else}
		<p role="alert">{data.error}</p>
	{/if}
</article>

<style lang="postcss">
	@reference "../../../lib/app.css";

	article {
		@apply mx-auto my-10 max-w-5xl px-4 sm:my-16;
	}

	h1 {
		@apply mt-5 text-4xl font-semibold leading-tight sm:text-6xl;
	}

	a {
		@apply text-sky-700 underline underline-offset-2;
	}

	[role="alert"] {
		@apply mt-6 rounded-lg border-2 border-amber-400 bg-amber-50 p-4;
	}
</style>
