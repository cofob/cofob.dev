<script lang="ts">
	import { AsciinemaPlayer as DesignSystemAsciinemaPlayer } from "@cofob2/design-system-asciinema-player/svelte";
	import { asciinemaPlayerHref } from "$lib/blog/asciinema";
	import { getBlogRenderMode } from "$lib/blog/render-mode";
	import { loadTerminalFont, terminalFontFamily } from "$lib/blog/terminal-font";
	import { Alert } from "@cofob2/design-system-svelte";
	import { onMount } from "svelte";

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
	let fontReady = $state(false);
	onMount(() => {
		if (renderMode === "portable") return;
		let active = true;
		// A failed font request must not prevent playback.
		void loadTerminalFont()
			.catch(() => undefined)
			.then(() => {
				if (active) fontReady = true;
			});
		return () => {
			active = false;
		};
	});
	let portableHref = $derived(asciinemaPlayerHref(src));
	let fallbackHref = $derived(directFallback ? src : portableHref);
	let options = $derived({
		...(cols === undefined ? {} : { cols }),
		...(rows === undefined ? {} : { rows }),
		preload,
		terminalFontFamily,
	});
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
{#if renderMode === "portable"}
	<p><a href={portableHref}>{label}</a></p>
{:else}
	<figure aria-label={label}>
		{#if fontReady}
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
		{:else}
			<Alert title="Терминальная запись" tone="info">
				<a href={fallbackHref}>{directFallback ? "Открыть запись напрямую" : "Открыть запись в плеере"}</a>
			</Alert>
		{/if}
	</figure>
{/if}
