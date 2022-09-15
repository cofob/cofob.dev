<script lang="ts">
	import { Meta, BlueLine, Section, Heading } from "$lib/components";
</script>

<Meta title="Главная" description="Персональный сайт кофоба" />

<Section>
	<div class="text-center">
		<Heading level={1}>
			Привет! Я <BlueLine animate>cofob</BlueLine>.
		</Heading>
		<p>Разработчик Python, Rust, Web приложений.</p>
		<a href="/portfolio">
			<button class="mt-2 font-semibold text-md rounded-lg border-2 border-zinc-800 p-1"> Портфолио -> </button>
		</a>
	</div>
</Section>
