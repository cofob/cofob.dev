<script lang="ts">
	export let animate = false;
</script>

<span class="top" class:animate>
	<span class="down"><slot /></span>
</span>

<style lang="postcss">
	.top {
		@apply before:block before:absolute before:h-2/4 before:w-3/4 before:bottom-0.5
					 before:-right-1 before:-skew-y-6 before:rounded-full before:bg-sky-300
					 relative inline-block;
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
