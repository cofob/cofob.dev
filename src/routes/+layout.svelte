<script lang="ts">
	import "$lib/app.css";
	import { page } from "$app/state";
	import { replaceState } from "$app/navigation";
	import { Footer, Navbar } from "$lib/components";
	import { onMount, type Snippet } from "svelte";
	import { SvelteURL } from "svelte/reactivity";
	import { lineRainbowStore } from "$lib/store";
	import { copyrightNotice, siteLicenseUrl } from "$lib/license";

	let { children }: { children: Snippet } = $props();

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
	<link rel="alternate" type="application/rss+xml" title="cofob.dev blog RSS" href="/rss.xml" />
	<link rel="alternate" type="application/atom+xml" title="cofob.dev blog Atom" href="/atom.xml" />
	<link rel="license" href={siteLicenseUrl} />
	<link rel="schema.dcterms" href="https://purl.org/dc/terms/" />
	<meta name="dcterms.rights" content={copyrightNotice} />
</svelte:head>

<div>
	<a class="skip-link" href="#main-content">Skip to main content</a>
	<Navbar />

	<main id="main-content" tabindex="-1">
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

	.skip-link {
		@apply fixed top-2 left-2 z-50 -translate-y-20 rounded-lg bg-zinc-800 px-3 py-2 font-semibold text-white;
	}

	.skip-link:focus {
		@apply translate-y-0;
	}
</style>
