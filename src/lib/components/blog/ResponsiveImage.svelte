<script lang="ts">
	import type { ResponsiveImageAsset } from "$lib/blog/types";

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
</script>

<img
	class={className}
	src={image.src}
	srcset={image.srcset}
	{sizes}
	width={image.width || undefined}
	height={image.height || undefined}
	{alt}
	{loading}
	{fetchpriority}
	decoding="async"
/>
