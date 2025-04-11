<script lang="ts">
	export let bg = "bg-zinc-100";
	export let border = "";
	export let textColor = "text-zinc-700";
</script>

<span class="{bg} {textColor} py-1 px-3 rounded-lg text-sm {border}"><slot /></span>
