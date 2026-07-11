<script lang="ts">
	import { resolve } from "$app/paths";
	import BlueLine from "./BlueLine.svelte";
</script>

<nav class="py-2 px-4">
	<div class="flex justify-between">
		<div>
			<a href={resolve("/")}><BlueLine>cofob</BlueLine></a>
		</div>
		<div class="flex gap-x-3">
			<a href={resolve("/blog")}>Blog</a>
			<a href={resolve("/pgp")}>PGP</a>
			<a href={resolve("/keys")}>SSH</a>
		</div>
	</div>
</nav>

<style lang="postcss">
	@reference "../app.css";

	a {
		@apply hover:underline;
	}
</style>
