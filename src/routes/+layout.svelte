<script lang="ts">
	import "$lib/app.css";
	import NProgress from "nprogress";
	import { navigating, page } from "$app/state";
	import { replaceState } from "$app/navigation";
	import { Footer, Navbar } from "$lib/components";
	import { onMount, type Snippet } from "svelte";
	import { SvelteURL } from "svelte/reactivity";
	import { lineRainbowStore } from "$lib/store";

	let { children }: { children: Snippet } = $props();

	NProgress.configure({
		showSpinner: false,
	});

	$effect(() => {
		if (!navigating) {
			NProgress.done();
			return;
		}

		const timer = window.setTimeout(() => {
			if (navigating) NProgress.start();
		}, 100);

		return () => window.clearTimeout(timer);
	});

	onMount(() => {
		const url = new SvelteURL(window.location.href);
		const hasRainbowQuery = url.searchParams.has("rainbow");
		const storedRainbow = sessionStorage.getItem("rainbow");

		if (hasRainbowQuery) {
			sessionStorage.setItem("rainbow", "1");
			lineRainbowStore.set(true);
		} else if (storedRainbow !== null) {
			lineRainbowStore.set(storedRainbow === "1");
		}

		if (hasRainbowQuery) {
			url.searchParams.delete("rainbow");
			// The URL is derived from the current page, not an application route literal.
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			replaceState(url, page.state);
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href={import.meta.env.VITE_IPFS_ENDPOINT} />
	<link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
</svelte:head>

<div>
	<Navbar />

	<main>
		{@render children()}
	</main>

	<Footer />
</div>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted deployment-controlled analytics markup -->
{@html import.meta.env.VITE_ANALYTICS}

<style lang="postcss">
	@reference "../lib/app.css";

	div {
		@apply flex flex-col min-h-screen;
	}

	main {
		flex: 1;
	}
</style>
