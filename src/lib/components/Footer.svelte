<script lang="ts">
	import BlueLine from "./BlueLine.svelte";
</script>

<footer class="text-center my-4">
	<p>(c) <BlueLine>cofob</BlueLine> 2021--{new Date().getFullYear()}</p>
	<p><a href="https://github.com/cofob/cofob.dev">Website source code</a></p>
</footer>

<style lang="postcss">
	a {
		@apply hover:underline;
	}
</style>
