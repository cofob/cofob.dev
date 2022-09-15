<script lang="ts">
	import { Meta } from "$lib/components";
	import { page } from "$app/stores";
</script>

<Meta title={$page.status.toString()} description="Ошибка {$page.status}" noindex />

<div>
	{#if $page.status == 404}
		<p>Страница не найдена</p>
	{/if}
	<p>Ошибка: {$page.error?.message}</p>
	<a href="/" class="link">На главную -></a>
</div>
