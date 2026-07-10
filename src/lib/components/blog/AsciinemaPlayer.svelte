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
					options: { cols?: number; rows?: number },
				): { dispose?: () => void };
			};
		}
	}
</script>

<script lang="ts">
	import { onMount } from "svelte";

	let {
		src,
		cols,
		rows,
		label = "Запись терминальной сессии",
	}: { src: string; cols?: number; rows?: number; label?: string } = $props();
	let target: HTMLDivElement;
	let ready = $state(false);
	let failed = $state(false);

	onMount(() => {
		let disposed = false;
		let player: { dispose?: () => void } | undefined;

		void loadPlayer()
			.then(() => {
				if (disposed || !window.AsciinemaPlayer) return;
				player = window.AsciinemaPlayer.create(src, target, { cols, rows });
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
<figure class="recording" aria-label={label}>
	<div class="player" bind:this={target}></div>
	{#if !ready}
		<p class="fallback" role={failed ? "status" : undefined}>
			{failed ? "Плеер не загрузился. " : "Загрузка плеера… "}
			<a href={src} target="_blank" rel="noopener noreferrer">Открыть запись напрямую</a>
		</p>
	{/if}
</figure>

<style lang="postcss">
	@reference "../../app.css";

	.recording {
		@apply my-8;
	}

	.player {
		@apply max-w-full overflow-x-auto rounded-lg bg-zinc-800;
	}

	.fallback {
		@apply my-0! rounded-lg border border-zinc-500 bg-zinc-100 px-4 py-3 text-base;
	}
</style>
