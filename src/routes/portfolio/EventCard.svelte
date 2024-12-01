<script lang="ts">
	export let name: string;
	export let source: string;
	export let meta: string;
</script>

<li>
	<a href={source} class="text-blue-500" target="_blank">
		{name}
	</a>
	<div class="text-sm text-zinc-500">{meta}</div>
	<p class="mt-1"><slot /></p>
</li>
