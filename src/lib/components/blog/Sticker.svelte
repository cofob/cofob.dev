<script lang="ts">
	let { src, alt, sourceName, sourceUrl }: { src: string; alt: string; sourceName: string; sourceUrl: string } =
		$props();
</script>

<!-- eslint-disable svelte/no-navigation-without-resolve -->
<figure class="sticker">
	<img {src} {alt} width="192" height="192" loading="lazy" decoding="async" />
	<figcaption>
		Источник: <a href={sourceUrl} target="_blank" rel="noopener noreferrer">{sourceName}</a>
	</figcaption>
</figure>

<style lang="postcss">
	@reference "../../app.css";

	.sticker {
		@apply mt-3 flex flex-col items-center text-center;
	}

	.sticker img {
		@apply m-0! mb-1! h-32! w-32! rounded-md! object-contain sm:h-40! sm:w-40!;
	}

	.sticker figcaption {
		@apply text-sm text-zinc-600;
	}

	.sticker a {
		color: inherit !important;
	}
</style>
