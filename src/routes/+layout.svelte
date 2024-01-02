<script lang="ts">
	import "$lib/app.css";
	import NProgress from "nprogress";
	import { navigating } from "$app/stores";
	import { Footer, Navbar } from "$lib/components";
	import { getIPFSLink } from "$lib/utils";
	import { onMount } from "svelte";
	import { lineRainbowStore } from "$src/lib/store";

	NProgress.configure({
		showSpinner: false,
	});

	$: {
		if ($navigating) {
			setTimeout(() => {
				if ($navigating) {
					NProgress.start();
				}
			}, 100);
		}
		if (!$navigating) {
			NProgress.done();
		}
	}

	onMount(() => {
		if (sessionStorage.getItem("rainbow")) {
			lineRainbowStore.set(sessionStorage.getItem("rainbow") === "1");
			let params = new URLSearchParams(window.location.search);
			if (params.has("rainbow")) {
				params.delete("rainbow");
				let query = params.size > 0 ? "?" + params.toString() : "";
				window.history.replaceState({}, document.title, window.location.pathname + query);
			}
		} else {
			let params = new URLSearchParams(window.location.search);
			if (params.has("rainbow")) {
				sessionStorage.setItem("rainbow", "1");
				lineRainbowStore.set(true);
				params.delete("rainbow");
				let query = params.size > 0 ? "?" + params.toString() : "";
				window.history.replaceState({}, document.title, window.location.pathname + query);
			}
		}
	});
</script>

<svelte:head>
	<link rel="preconnect" href={import.meta.env.VITE_IPFS_ENDPOINT} />
	<link
		rel="icon"
		type="image/x-icon"
		href={getIPFSLink("bafybeig42d7cgsldoaaw7o4snl7sikfg4exi72gx3an2dgzqpy2x5dvnti/favicon.ico")}
	/>
</svelte:head>

<div>
	<Navbar />

	<main>
		<slot />
	</main>

	<Footer />
</div>

{@html import.meta.env.VITE_ANALYTICS}

<style lang="postcss">
	div {
		@apply flex flex-col min-h-screen;
	}

	main {
		flex: 1;
	}
</style>
