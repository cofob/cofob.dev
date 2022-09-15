<script lang="ts">
	export let level: number;

	let element = `h${level}`;
</script>

<svelte:element this={element} class={element}><slot /></svelte:element>

<style>
	.h1 {
		@apply sm:text-7xl text-5xl font-semibold mb-2;
	}

	.h2 {
		@apply sm:text-6xl text-4xl font-medium mb-2;
	}

	.h3 {
		@apply sm:text-5xl text-3xl font-medium mb-2;
	}

	.h4 {
		@apply sm:text-4xl text-2xl;
	}

	.h5 {
		@apply sm:text-3xl text-xl;
	}

	.h6 {
		@apply sm:text-2xl text-lg;
	}
</style>
