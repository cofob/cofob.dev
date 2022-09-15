<script lang="ts">
	import "$lib/app.css";
	import NProgress from "nprogress";
	import { navigating } from "$app/stores";
	import { Footer, Navbar } from "$lib/components";
	import { getIPFSLink } from "$lib/utils";

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
</script>

<svelte:head>
	<link rel="preconnect" href={import.meta.env.VITE_IPFS_ENDPOINT} />
	<link
		rel="icon"
		type="image/x-icon"
		href={getIPFSLink("bafybeig42d7cgsldoaaw7o4snl7sikfg4exi72gx3an2dgzqpy2x5dvnti/favicon.ico")}
	/>
</svelte:head>

<Navbar />

<main>
	<slot />
</main>

<Footer />

{@html import.meta.env.VITE_ANALYTICS}
