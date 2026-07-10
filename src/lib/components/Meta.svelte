<script lang="ts">
	import { absoluteSiteUrl } from "$lib/blog/url";
	import { getIPFSLink } from "$lib/utils";

	let {
		title,
		description,
		cover = getIPFSLink("bafybeibkbtxn255q765pfxw2tcfgi34bnehu3egsiro7xwpvtfl4nx6a7e/splash.png"),
		url = "/",
		type = "website",
		lang = "en",
		published,
		updated,
		noindex = false,
	}: {
		title: string;
		description: string;
		cover?: string;
		url?: string;
		type?: "website" | "article";
		lang?: string;
		published?: string;
		updated?: string;
		noindex?: boolean;
	} = $props();
	let fullTitle = $derived(`${title} — cofob.dev`);
	let canonical = $derived(absoluteSiteUrl(url));
	let absoluteCover = $derived(cover.startsWith("http") ? cover : absoluteSiteUrl(cover));
	let locale = $derived(lang.replace("-", "_"));
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<link rel="canonical" href={canonical} />

	<meta content="#7dd3fc" name="theme-color" />
	<meta content={lang} name="language" />
	<meta content={locale} property="og:locale" />
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
	<meta content={absoluteCover} property="og:image" />
	<meta content={absoluteCover} property="twitter:image" />
	<meta content={canonical} property="og:url" />
	<meta content={type} property="og:type" />
	{#if type === "article" && published}<meta content={published} property="article:published_time" />{/if}
	{#if type === "article" && updated}<meta content={updated} property="article:modified_time" />{/if}
	<meta content="summary_large_image" property="twitter:card" />
</svelte:head>
