<script lang="ts">
	import type { ResponsiveImageAsset } from "$lib/blog/types";
	import { ResponsiveImage } from "@cofob/design-system-svelte";

	let {
		image,
		alt = image.alt,
		sizes = "(min-width: 800px) 768px, calc(100vw - 2rem)",
		loading = "lazy",
		fetchpriority,
		class: className,
	}: {
		image: ResponsiveImageAsset;
		alt?: string;
		sizes?: string;
		loading?: "eager" | "lazy";
		fetchpriority?: "high" | "low" | "auto";
		class?: string;
	} = $props();
	let source = $derived({ ...image, alt, sizes });
</script>

<ResponsiveImage
	image={source}
	class={className}
	priority={loading === "eager" || fetchpriority === "high"}
	fit="cover"
/>
