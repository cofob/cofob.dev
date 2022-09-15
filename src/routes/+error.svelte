<script lang="ts">
	import { Meta, Section } from "$lib/components";
	import { page } from "$app/stores";
	import BlueLine from "$src/lib/components/BlueLine.svelte";
</script>

<Meta title={$page.status.toString()} description="Ошибка {$page.status}" noindex />

<Section>
	<div class="text-center">
		<h1 class="sm:text-7xl text-5xl font-semibold">
			<BlueLine animate>{$page.status}.</BlueLine>
		</h1>
		{#if $page.status == 404}
			<p>Страница не найдена</p>
		{/if}
		<p>{$page.error?.message}</p>
		<a href="/" class="link">На главную -></a>
	</div>
</Section>
