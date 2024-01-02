<script lang="ts">
	import { Meta, Section, Heading } from "$lib/components";
	import Card from "./Card.svelte";
</script>

<Meta title="Портфолио" description="Список проектов кофоба" />

<Section>
	<div class="text-center">
		<Heading level={1}>Портфолио</Heading>
	</div>

	<div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-4">
		<Card source="https://github.com/nix-community/mineflake" name="Mineflake">
			Утилита для декларативного создания майнкрафт серверов. Написана при помощи Rust и Nix.
		</Card>
		<Card source="https://github.com/cofob/cofob.dev" name="Этот сайт">
			Сайт на SvelteKit и TailwindCSS. Сделан для того, чтобы показать свои проекты и немного рассказать о себе.
		</Card>
		<Card source="https://github.com/fire-square" name="firesquare.ru">
			Майнкрафт сервер с богатой историей. Под него разработана своя система деплоя через NixOS (mineflake), свои
			плагины, в процессе лаунчер и сайт. Работает более года.
		</Card>
		<Card source="https://github.com/fire-square/firesquare" name="firesquare launcher">
			Майнкрафт лаунчер и API на Rust + Tauri + Yew + Axum. Разработан для firesquare.ru.
		</Card>
		<Card source="https://github.com/cofob/AlfisViewer/" name="AlfisViewer">
			Alfis блокчейн обозреватель на Django.
		</Card>
		<Card source="https://github.com/cofob/DiscordRPC" name="DiscordRPC">
			Python программа для собственного статуса Discord Rich Presence.
		</Card>
		<Card source="https://github.com/cofob/Emercoin.py" name="Emercoin.py">Python API для Emercoin блокчейна.</Card>
		<Card source="https://github.com/cofob/EmerVPN" name="EmerVPN"
			>Proof-of-concept реализация анонимного full-mesh wireguard пиринга на блокчейне Emercoin.</Card
		>
		<div class="rounded-lg border-2">
			<div class="m-2">
				Больше проектов на моём <a href="https://github.com/cofob/" class="link" target="_blank">GitHub</a>.
			</div>
		</div>
	</div>
</Section>
