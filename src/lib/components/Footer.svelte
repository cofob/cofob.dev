<script lang="ts">
	import BlueLine from "./BlueLine.svelte";
</script>

<footer class="text-center my-4">
	<p>(c) <BlueLine>cofob</BlueLine>@riseup.net 2021--{new Date().getFullYear()}</p>
	<p>IE Egor Ternovoi (304739031, Tbilisi, Georgia)</p>
</footer>

<style lang="postcss">
	a {
		@apply hover:underline;
	}
</style>
