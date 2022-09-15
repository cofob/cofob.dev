<script lang="ts">
	import { Meta, Section } from "$lib/components";
	import { page } from "$app/stores";
</script>

<Meta title={$page.status.toString()} description="Ошибка {$page.status}" noindex />

<Section>
	<div class="text-center">
		<h1 class="sm:text-2xl text-xl font-semibold">
			{#if $page.status == 404}
				Страница не найдена
			{:else}
				Ошибка {$page.status}
			{/if}
		</h1>
		<p>{$page.error?.message}</p>
		<a href="/" class="link">На главную -></a>
	</div>
</Section>
