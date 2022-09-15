<script lang="ts">
	import { getIPFSLink } from "$lib/utils";

	export let title: string;
	export let description: string;
	export let cover: string = getIPFSLink("bafybeibkbtxn255q765pfxw2tcfgi34bnehu3egsiro7xwpvtfl4nx6a7e/splash.png");
	export let noindex = false;

	title = title + " — cofob.ru";
</script>

<svelte:head>
	<title>{title}</title>

	<!-- Meta - запрещённая в России организация -->
	<meta content="#7dd3fc" name="theme-color" />
	<meta content="Russian" name="language" />
	<meta content="ru_RU" name="og:locale" />
	<meta content="cofob.ru" property="og:site_name" />
	<meta
		content="cofob,cofob.ru,персональный сайт,personal website,кофоб,егор терновой,portfolio,портфолио"
		name="keywords"
	/>
	<meta content="index, follow" name="robots" />
	<meta content={title} name="title" />
	<meta content={title} property="og:title" />
	<meta content={title} property="twitter:title" />
	<meta content={description} name="description" />
	<meta content={description} property="og:description" />
	<meta content={description} property="twitter:description" />
	<meta content={cover} property="og:image" />
	<meta content={cover} property="twitter:image" />
	<meta content="website" property="og:type" />
	<meta content="summary_large_image" property="twitter:card" />

	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}
	<!-- Ебать сколько тэгов. -->
</svelte:head>
