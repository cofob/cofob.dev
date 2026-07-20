<script module lang="ts">
	const PLAYER_SCRIPT = "/static/vendor/asciinema-player/3.17.0/asciinema-player.min.js";
	let playerScript: Promise<void> | undefined;

	function loadPlayer(): Promise<void> {
		if (window.AsciinemaPlayer) return Promise.resolve();
		if (playerScript) return playerScript;

		playerScript = new Promise((resolve, reject) => {
			const existing = document.querySelector<HTMLScriptElement>(`script[src="${PLAYER_SCRIPT}"]`);
			const script = existing ?? document.createElement("script");
			script.addEventListener("load", () => resolve(), { once: true });
			script.addEventListener("error", () => reject(new Error("Could not load asciinema player")), { once: true });
			if (!existing) {
				script.src = PLAYER_SCRIPT;
				script.async = true;
				document.head.append(script);
			}
		});

		return playerScript;
	}

	declare global {
		interface Window {
			AsciinemaPlayer?: {
				create(
					source: string,
					target: HTMLElement,
					options: { cols?: number; rows?: number; preload?: boolean },
				): { dispose?: () => void };
			};
		}
	}
</script>

<script lang="ts">
	import { onMount } from "svelte";
	import { Alert, Card, Link, Stack } from "@cofob/design-system-svelte";
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
	let target = $state<HTMLDivElement>();
	let ready = $state(false);
	let failed = $state(false);
	const renderMode = getBlogRenderMode();
	let portableHref = $derived(asciinemaPlayerHref(src));

	onMount(() => {
		let disposed = false;
		let player: { dispose?: () => void } | undefined;

		void loadPlayer()
			.then(() => {
				if (disposed || !window.AsciinemaPlayer || !target) return;
				player = window.AsciinemaPlayer.create(src, target, { cols, rows, preload });
				ready = true;
			})
			.catch(() => {
				failed = true;
			});

		return () => {
			disposed = true;
			player?.dispose?.();
		};
	});
</script>

<svelte:head>
	<link rel="stylesheet" href="/static/vendor/asciinema-player/3.17.0/asciinema-player.css" />
</svelte:head>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
{#if renderMode === "portable"}
	<p><a href={portableHref}>{label}</a></p>
{:else}
	<figure aria-label={label}>
		<Stack gap="sm">
			<Card padding="none"><div bind:this={target} data-asciinema-player-mount></div></Card>
			{#if !ready}
				<Alert title={failed ? "Плеер не загрузился" : "Терминальная запись"} tone={failed ? "warning" : "info"}>
					<Link href={directFallback ? src : portableHref} external rel="noopener noreferrer">
						{directFallback ? "Открыть запись напрямую" : "Открыть запись в плеере"}
					</Link>
				</Alert>
			{/if}
		</Stack>
	</figure>
{/if}
