<script lang="ts">
	import { resolve } from "$app/paths";
	import { copyrightEmail, copyrightHolderName, siteLicensePath } from "$lib/license";
	import BlueLine from "./BlueLine.svelte";
</script>

<footer class="text-center my-4">
	<p>
		© <BlueLine>{copyrightHolderName}</BlueLine> 2021–{new Date().getFullYear()} ·
		<a href={`mailto:${copyrightEmail}`}>{copyrightEmail}</a>
	</p>
	<p><a href={resolve("/rss.xml")}>RSS</a> · <a href={resolve("/atom.xml")}>Atom</a></p>
	<p>
		<a href={resolve(siteLicensePath)}>License</a> ·
		<a href="https://github.com/cofob/cofob.dev">Website source code</a>
	</p>
</footer>

<style lang="postcss">
	@reference "../app.css";

	a {
		@apply hover:underline;
	}
</style>
