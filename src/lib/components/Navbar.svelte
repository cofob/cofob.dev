<script lang="ts">
	import BlueLine from "./BlueLine.svelte";
</script>

<nav class="py-2 px-4">
	<div class="flex justify-between">
		<div>
			<a href="/"><BlueLine>cofob</BlueLine></a>
		</div>
		<div class="flex gap-x-3">
			<a href="https://keys.openpgp.org/vks/v1/by-fingerprint/5F3D9D3DECE08651DE14D29FACAD4265E193794D">PGP</a>
			<a href="https://zhub.link/@cofob" target="_blank" rel="me">Mastodon</a>
			<a href="/portfolio">Портфолио</a>
		</div>
	</div>
</nav>

<style>
	a {
		@apply hover:underline;
	}
</style>
