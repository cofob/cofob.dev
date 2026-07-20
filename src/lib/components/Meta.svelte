<script lang="ts">
	import { siteSocialImage } from "$lib/blog/catalog";
	import type { SocialImageAsset } from "$lib/blog/types";
	import { absoluteSiteUrl } from "$lib/blog/url";
	import type { JsonLdDocument } from "$lib/seo/structured-data";
	import { serializeJsonLd } from "$lib/seo/structured-data";
	import { getIPFSLink } from "$lib/utils";

	const fallbackImage: SocialImageAsset = {
		src: getIPFSLink("bafybeibkbtxn255q765pfxw2tcfgi34bnehu3egsiro7xwpvtfl4nx6a7e/splash.png"),
		width: 1200,
		height: 630,
		type: "image/png",
		alt: "cofob.dev",
	};

	let {
		title,
		description,
		image = siteSocialImage ?? fallbackImage,
		url = "/",
		type = "website",
		lang = "en",
		published,
		updated,
		noindex = false,
		structuredData,
	}: {
		title: string;
		description: string;
		image?: SocialImageAsset;
		url?: string;
		type?: "website" | "article";
		lang?: string;
		published?: string;
		updated?: string;
		noindex?: boolean;
		structuredData?: JsonLdDocument;
	} = $props();
	let fullTitle = $derived(`${title} — cofob.dev`);
	let canonical = $derived(absoluteSiteUrl(url));
	let absoluteImage = $derived(image.src.startsWith("http") ? image.src : absoluteSiteUrl(image.src));
	let locale = $derived(lang.replace("-", "_"));
	let structuredJson = $derived(structuredData ? serializeJsonLd(structuredData) : undefined);

	function jsonLdScript(json: string): string {
		return `<script type="application/ld+json">${json}<` + "/script>";
	}
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<link rel="canonical" href={canonical} />

	<meta content="#7dd3fc" name="theme-color" />
	<meta content={lang} name="language" />
	<meta content={locale} property="og:locale" />
	<meta content="cofob.dev" property="og:site_name" />
	<meta content="cofob,cofob.dev,персональный сайт,personal website,кофоб,егор терновой" name="keywords" />
	<meta content={noindex ? "noindex" : "index, follow"} name="robots" />
	<meta content={fullTitle} name="title" />
	<meta content={fullTitle} property="og:title" />
	<meta content={fullTitle} property="twitter:title" />
	<meta content={description} name="description" />
	<meta content={description} property="og:description" />
	<meta content={description} property="twitter:description" />
	<meta content={absoluteImage} property="og:image" />
	<meta content={absoluteImage} property="og:image:secure_url" />
	<meta content={String(image.width)} property="og:image:width" />
	<meta content={String(image.height)} property="og:image:height" />
	<meta content={image.type} property="og:image:type" />
	<meta content={image.alt} property="og:image:alt" />
	<meta content={absoluteImage} property="twitter:image" />
	<meta content={image.alt} property="twitter:image:alt" />
	<meta content={canonical} property="og:url" />
	<meta content={type} property="og:type" />
	{#if type === "article" && published}<meta content={published} property="article:published_time" />{/if}
	{#if type === "article" && updated}<meta content={updated} property="article:modified_time" />{/if}
	<meta content="summary_large_image" property="twitter:card" />
	{#if structuredJson}
		<!-- eslint-disable-next-line svelte/no-at-html-tags -- generated JSON has script-breaking characters escaped -->
		{@html jsonLdScript(structuredJson)}
	{/if}
</svelte:head>
