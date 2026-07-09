<script lang="ts">
	import { getIPFSLink } from "$lib/utils";

	let {
		title,
		description,
		cover = getIPFSLink("bafybeibkbtxn255q765pfxw2tcfgi34bnehu3egsiro7xwpvtfl4nx6a7e/splash.png"),
		noindex = false,
	}: { title: string; description: string; cover?: string; noindex?: boolean } = $props();
	let fullTitle = $derived(`${title} — cofob.dev`);
</script>

<svelte:head>
	<title>{fullTitle}</title>

	<!-- Meta - запрещённая в России организация -->
	<meta content="#7dd3fc" name="theme-color" />
	<meta content="Russian" name="language" />
	<meta content="en_US" name="og:locale" />
	<meta content="cofob.dev" property="og:site_name" />
	<meta
		content="cofob,cofob.dev,персональный сайт,personal website,кофоб,егор терновой,portfolio,портфолио"
		name="keywords"
	/>
	<meta content={noindex ? "noindex" : "index, follow"} name="robots" />
	<meta content={fullTitle} name="title" />
	<meta content={fullTitle} property="og:title" />
	<meta content={fullTitle} property="twitter:title" />
	<meta content={description} name="description" />
	<meta content={description} property="og:description" />
	<meta content={description} property="twitter:description" />
	<meta content={cover} property="og:image" />
	<meta content={cover} property="twitter:image" />
	<meta content="website" property="og:type" />
	<meta content="summary_large_image" property="twitter:card" />
	<!-- Ебать сколько тэгов. -->
</svelte:head>
