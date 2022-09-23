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
		<Card source="https://git.frsqr.xyz/cofob/cofob.ru" name="Этот сайт">
			Написан за 2 дня с использованием Svelte и TailwindCSS. Размещён в сети IPFS.
		</Card>
		<Card source="https://git.frsqr.xyz/firesquare" name="firesquare.ru">
			Майнкрафт сервер с богатой историей. Под него разработана своя система деплоя через NixOS (mineflake), свои
			плагины, в процессе лаунчер и сайт. Работает более года.
		</Card>
		<Card source="https://git.frsqr.xyz/firesquare/mineflake" name="Mineflake">
			NixOS модуль для лёгкого декларативного создания майнкрафт серверов.
		</Card>
		<Card source="https://github.com/fire-square/autodonate" name="Autodonate">
			Сайт авто-продаж на Svelte и Django. Архивирован.
		</Card>
		<Card source="https://sr.ht/~cofob/AlfisViewer/" name="AlfisViewer">
			Alfis блокчейн обозреватель написанный за 3 дня на Django.
		</Card>
		<Card source="https://git.frsqr.xyz/firesquare/ItemControl" name="ItemControl">
			Майнкрафт плагин который автоматически удаляет нелегальные вещи.
		</Card>
		<Card source="https://git.frsqr.xyz/firesquare/BlockRename" name="BlockRename">
			Майнкрафт плагин который блокирует некоторые переименования на наковальне. Нужен, например, для создания
			уникальных скинов.
		</Card>
		<Card source="https://git.frsqr.xyz/firesquare/Shutdown" name="Shutdown">
			Майнкрафт плагин который выключает сервер <i>красиво</i>.
		</Card>
		<Card source="https://git.frsqr.xyz/firesquare/KickOnJoin" name="KickOnJoin">
			Майнкрафт плагин для whitelist на основе прав.
		</Card>
		<Card source="https://git.frsqr.xyz/firesquare/Governs" name="Governs">Майнкрафт плагин для государств.</Card>
		<Card source="https://git.frsqr.xyz/firesquare/ExecuteIn" name="ExecuteIn">
			Майнкрафт плагин для выполнения определенных комманд в регионах.
		</Card>
		<Card source="https://sr.ht/~cofob/ClansFork/" name="Clans">Open-source форк плагина "Clans" с фиксом багов.</Card>
		<Card source="https://git.frsqr.xyz/firesquare/Shutdown" name="DiscordRPC">
			Python программа для собственного статуса Discord Rich Presence.
		</Card>
		<Card source="https://sr.ht/~cofob/Emercoin.py/" name="Emercoin.py">Python API для Emercoin блокчейна.</Card>
		<Card source="https://git.frsqr.xyz/cofob/EmerVPN" name="EmerVPN"
			>Proof-of-concept реализация анонимного full-mesh wireguard пиринга на блокчейне Emercoin.</Card
		>
		<div class="rounded-lg border-2 h-min">
			<div class="m-2">
				Больше проектов на моём <a href="https://git.frsqr.xyz/explore/repos" class="link" target="_blank"
					>гит хостинге</a
				>. Старые проекты можно найти на <a href="https://notabug.org/cofob" class="link" target="_blank">notabug</a>,
				<a href="https://sr.ht/~cofob/" class="link" target="_blank">sr.ht</a>,
				<a href="https://github.com/cofob/" class="link" target="_blank">github</a>.
			</div>
		</div>
	</div>
</Section>
