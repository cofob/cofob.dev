<script lang="ts">
	import { Meta, BlueLine, Section, Heading } from "$lib/components";
</script>

<Meta title="Home" description="cofob's personal website" />

<Section>
	<div class="text-center py-20 sm:py-32">
		<Heading level={1}>
			Hi! I'm <BlueLine v2 animate>Egor Ternovoi</BlueLine>.
		</Heading>
		<p>Fullstack development services.</p>
		<a href="mailto:cofob@riseup.net">
			<button class="mt-2 font-semibold text-md rounded-lg border-2 border-zinc-800 p-1"> Email me! </button>
		</a>
	</div>
</Section>
