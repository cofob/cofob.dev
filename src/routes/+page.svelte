<script lang="ts">
	import { Meta, BlueLine, Section, Heading } from "$lib/components";
</script>

<Meta title="Home" description="cofob's personal website" />

<Section>
	<div class="text-center py-20 sm:py-32">
		<Heading level={1}>
			Hi! I'm <BlueLine animate>cofob</BlueLine>.
		</Heading>
		<p>Python developer.</p>
		<a href="/portfolio">
			<button class="mt-2 font-semibold text-md rounded-lg border-2 border-zinc-800 p-1"> Portfolio -> </button>
		</a>
	</div>
</Section>
