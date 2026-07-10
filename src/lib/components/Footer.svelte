<script lang="ts">
	import { resolve } from "$app/paths";
	import BlueLine from "./BlueLine.svelte";
</script>

<footer class="text-center my-4">
	<p>(c) <BlueLine>cofob</BlueLine> 2021--{new Date().getFullYear()}</p>
	<p><a href={resolve("/rss.xml")}>RSS</a> · <a href={resolve("/atom.xml")}>Atom</a></p>
	<p><a href="https://github.com/cofob/cofob.dev">Website source code</a></p>
</footer>

<style lang="postcss">
	@reference "../app.css";

	a {
		@apply hover:underline;
	}
</style>
