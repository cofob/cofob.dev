<script lang="ts">
	import BlueLine from "./BlueLine.svelte";
</script>

<nav class="py-2 px-4">
	<div class="flex justify-between">
		<div>
			<a href="/"><BlueLine>cofob</BlueLine></a>
		</div>
		<div class="flex gap-x-3">
			<a href="/pgp">PGP</a>
			<a href="/portfolio">Портфолио</a>
		</div>
	</div>
</nav>

<style lang="postcss">
	a {
		@apply hover:underline;
	}
</style>
