<script lang="ts">
	import { Meta } from "$lib/components";
	import { page } from "$app/stores";
</script>

<Meta title="Ошибка" description="Ошибка {status}" noindex />

<div>
	{#if $page.status == 404}
		<p>404</p>
	{/if}
	{$page.error?.message}
	<a href="/">на главную -></a>
</div>
