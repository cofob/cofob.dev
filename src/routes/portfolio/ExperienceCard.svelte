<script lang="ts">
	export let company: string;
	export let location: string;
	export let title: string;
	export let date: string;
	export let children: string;
</script>

<div class="rounded-lg border-2 p-4 mb-4">
	<div class="text-lg font-semibold">{title}</div>
	<div class="text-sm text-zinc-500">{company} | {location}</div>
	<div class="text-sm text-zinc-500">{date}</div>
	<slot />
</div>
