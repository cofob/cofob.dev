<script lang="ts">
	import { AsciinemaPlayer as DesignSystemAsciinemaPlayer } from "@cofob/design-system-asciinema-player/svelte";
	import { asciinemaPlayerHref } from "$lib/blog/asciinema";
	import { getBlogRenderMode } from "$lib/blog/render-mode";

	let {
		src,
		cols,
		rows,
		label = "Запись терминальной сессии",
		directFallback = false,
		preload = true,
	}: {
		src: string;
		cols?: number;
		rows?: number;
		label?: string;
		directFallback?: boolean;
		preload?: boolean;
	} = $props();
	const renderMode = getBlogRenderMode();
	let portableHref = $derived(asciinemaPlayerHref(src));
	let fallbackHref = $derived(directFallback ? src : portableHref);
	let options = $derived({
		...(cols === undefined ? {} : { cols }),
		...(rows === undefined ? {} : { rows }),
		preload,
	});
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
{#if renderMode === "portable"}
	<p><a href={portableHref}>{label}</a></p>
{:else}
	<DesignSystemAsciinemaPlayer
		source={src}
		{options}
		{label}
		{fallbackHref}
		labels={{
			loadingTitle: "Терминальная запись",
			errorTitle: "Плеер не загрузился",
			fallbackLink: directFallback ? "Открыть запись напрямую" : "Открыть запись в плеере",
		}}
	/>
{/if}
