<script lang="ts">
	import { Meta, Section, BlueLine, Heading } from "$lib/components";
	import { page } from "$app/stores";
</script>

<Meta title={$page.status.toString()} description="Ошибка {$page.status}" noindex />

<Section>
	<div class="text-center">
		<Heading level={1}>
			<BlueLine animate>{$page.status}.</BlueLine>
		</Heading>
		{#if $page.status == 404}
			<p>Страница не найдена</p>
		{/if}
		<p>{$page.error?.message}</p>
		<a href="/" class="link">На главную -></a>
	</div>
</Section>
