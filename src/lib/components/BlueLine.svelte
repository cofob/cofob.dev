<script lang="ts">
	import { onMount } from "svelte";

	export let animate = false;
	export let rainbow: boolean | undefined = undefined;

	let rainbowLocal = rainbow || false;
	onMount(() => {
		let params = new URLSearchParams(window.location.search);
		if (params.has("gay")) {
			rainbowLocal = true;
		}
	});
</script>

<span class="top {rainbowLocal ? 'rainbow' : 'blue'}" class:animate>
	<span class="down"><slot /></span>
</span>

<style lang="postcss">
	.top {
		@apply before:block before:absolute before:h-2/4 before:w-3/4 before:bottom-0.5
					 before:-right-1 before:-skew-y-6 before:rounded-full relative inline-block;
	}

	.blue {
		@apply before:bg-sky-300;
	}

	.rainbow::before {
		background: rgb(121, 9, 9);
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
		animation: 0.75s show ease;
	}

	.down {
		@apply relative;
	}

	@keyframes show {
		from {
			width: 20%;
		}
		to {
			width: 75%;
		}
	}
</style>
