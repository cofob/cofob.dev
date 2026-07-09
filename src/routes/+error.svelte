<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { Meta, Section, BlueLine, Heading } from "$lib/components";
</script>

<Meta title={page.status.toString()} description={`Error ${page.status}`} noindex />

<Section>
	<div class="text-center">
		<Heading level={1}>
			<BlueLine animate>{page.status}.</BlueLine>
		</Heading>
		{#if page.status === 404}
			<p>Page not found</p>
		{/if}
		<p>{page.error?.message}</p>
		<a href={resolve("/")} class="link">Home -&gt;</a>
	</div>
</Section>
