<script lang="ts">
	export let name: string;
	export let source: string;
</script>

<div class="rounded-lg border-2">
	<div class="m-2 flex flex-col min-h-full">
		<p class="font-medium text-center">{name}</p>
		<p class="mt-1 mx-1" style="flex: 1"><slot /></p>
		<a href={source} target="_blank" class="mb-4">
			<button>Source code</button>
		</a>
	</div>
</div>

<style lang="postcss">
	button {
		@apply mt-2 w-full h-8 border-2 rounded-lg hover:bg-zinc-100 motion-safe:transition-colors;
	}
</style>
