<script lang="ts">
	import { Meta, Section, Heading } from "$lib/components";
	import Card from "./Card.svelte";
</script>

<Meta title="Portfolio" description="cofob portfolio" />

<Section>
	<div class="text-center">
		<Heading level={1}>Portfolio</Heading>
		<p>
			<b>⚠️ Page outdated!</b> Actual info on
			<a href="https://github.com/cofob" class="link" target="_blank">GitHub</a>.
		</p>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
		<Card source="https://github.com/nix-community/mineflake" name="Mineflake">
			A utility for declarative creation of minecraft servers. Written with the help of Rust and Nix.
		</Card>
		<Card source="https://github.com/cofob/cofob.dev" name="This site">
			Site on SvelteKit and TailwindCSS. Made to show my projects and tell a little about myself.
		</Card>
		<Card source="https://github.com/fire-square" name="firesquare.ru">
			Minecraft server with a rich history. Under it developed its own system deploy through NixOS (mineflake), its own
			plugins. Worked for 2 years.
		</Card>
		<Card source="https://github.com/cofob/AlfisViewer/" name="AlfisViewer">Alfis blockchain observer on Django.</Card>
		<Card source="https://github.com/cofob/DiscordRPC" name="DiscordRPC">
			Python program for Discord Rich Presence's own Discord status.
		</Card>
		<Card source="https://github.com/cofob/Emercoin.py" name="Emercoin.py">Python API for Emercoin blockchain.</Card>
		<Card source="https://github.com/cofob/EmerVPN" name="EmerVPN"
			>Proof-of-concept implementation of anonymous full-mesh wireguard peering on the Emercoin blockchain.</Card
		>
		<div class="rounded-lg border-2">
			<div class="m-2">
				More projects on my <a href="https://github.com/cofob/" class="link" target="_blank">GitHub</a>.
			</div>
		</div>
	</div>
</Section>
