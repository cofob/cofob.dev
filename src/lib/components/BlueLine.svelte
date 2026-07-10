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
		position: relative;
		display: inline-block;
	}

	.top::before {
		content: "";
		position: absolute;
		right: -0.25rem;
		bottom: 0.125rem;
		display: block;
		width: 75%;
		height: 50%;
		transform: translate(0, 0) rotate(0) skew(0) skewY(-6deg) scaleX(1) scaleY(1);
		border-radius: 9999px;
	}

	.blue::before {
		background-color: #7dd3fc;
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
