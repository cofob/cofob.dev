<script lang="ts">
	import { Meta, BlueLine } from "$lib/components";
	import Section from "$src/lib/components/Section.svelte";
</script>

<Meta title="Главная" description="Персональный сайт кофоба" />

<Section>
	<div class="text-center">
		<p class="text-7xl font-medium">
			Привет! Я <BlueLine animate>cofob</BlueLine>.
		</p>
		<p>Разработчик Python, Rust, Web приложений.</p>
		<a href="/portfolio">
			<button class="mt-2 font-semibold text-md rounded-lg border-2 border-zinc-800 p-1"> Портфолио -> </button>
		</a>
	</div>
</Section>
