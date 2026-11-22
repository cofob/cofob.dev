<script lang="ts">
	import { resolve } from "$app/paths";
	import { page } from "$app/state";
	import { BlueLine, Container, EmptyState, Link, Meta, Section } from "$lib/components";
	import { lineRainbowStore } from "$lib/store";
</script>

<Meta title={page.status.toString()} description={`Error ${page.status}`} noindex />

{#snippet homeAction()}<Link href={resolve("/")}>Home →</Link>{/snippet}
{#snippet errorIcon()}<BlueLine animate rainbow={$lineRainbowStore}>{page.status}</BlueLine>{/snippet}

<Container size="narrow">
	<Section data-spacing="lg">
		<EmptyState
			title={`${page.status}.`}
			description={page.status === 404 ? "Page not found" : (page.error?.message ?? "Unexpected error")}
			action={homeAction}
			icon={errorIcon}
		/>
	</Section>
</Container>
