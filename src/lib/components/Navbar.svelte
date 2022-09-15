<script lang="ts">
	import Cofob from "./Cofob.svelte";
</script>

<nav class="py-2 px-4">
	<div class="flex justify-between">
		<div>
			<a href="/"><Cofob /></a>
		</div>
		<div class="flex gap-x-3">
			<a href="/portfolio">Портфолио</a>
		</div>
	</div>
</nav>

<style>
	a {
		@apply hover:underline;
	}
</style>
