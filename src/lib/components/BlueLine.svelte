<script lang="ts">
	import { lineRainbowStore } from "$lib/store";
	import type { Snippet } from "svelte";

	let { animate = false, rainbow, children }: { animate?: boolean; rainbow?: boolean; children: Snippet } = $props();
	let rainbowLocal = $derived(rainbow ?? $lineRainbowStore);
</script>

<span class="top {rainbowLocal ? 'rainbow' : 'blue'}" class:animate>
	<span class="down">{@render children()}</span>
</span>

<style lang="postcss">
	@reference "../app.css";

	.top {
		@apply before:block before:absolute before:h-2/4 before:w-3/4 before:bottom-0.5
					 before:-right-1 before:-skew-y-6 before:rounded-full relative inline-block;
	}

	.blue {
		@apply before:bg-sky-300;
	}

	.rainbow::before {
		background: linear-gradient(
			80deg,
			#ff000090 0%,
			#ff000090 14%,
			#ffa50090 18%,
			#ffa50090 30%,
			#ffff0090 34%,
			#ffff0090 46%,
			#00800090 50%,
			#00800090 62%,
			#0000ff90 66%,
			#0000ff90 78%,
			#4c008290 82%,
			#4b008290 100%
		);
	}

	.animate::before {
		will-change: transform;
		animation: 0.75s show ease;
		transform-origin: right;
	}

	.down {
		@apply relative;
	}

	@keyframes show {
		from {
			transform: skewY(-6deg) scaleX(0.25);
		}
		to {
			transform: skewY(-6deg) scaleX(1);
		}
	}
</style>
