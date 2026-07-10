---
title: "codex-start: Codex в отдельном контейнере"
description: "Как я сделал для Codex изолированное окружение с worktree, управляемой сетью и нормальным lifecycle."
published: 2026-07-10T18:00:00+00:00
lang: ru
draft: true
---

<script>
	import AsciinemaPlayer from "$lib/components/blog/AsciinemaPlayer.svelte";
	import ChatThread from "$lib/components/blog/ChatThread.svelte";
</script>

Однажды Codex во время задачи прочитал секретный `.env`. Файл уехал на серверы OpenAI, а я пошёл ротировать секреты.

Встроенный sandbox я настроить так и не смог: правила получались либо слишком слабыми, либо настолько строгими, что нормально работать было невозможно. Мне хотелось просто запускать агента без human approvals, но при этом точно знать, что он не видит лишние файлы и не ходит куда попало.

Так появился [codex-start](https://github.com/cofob/codex-start). Он запускает обычный Codex CLI внутри отдельного Docker- или Podman-контейнера и сам управляет окружением вокруг него.

Сейчас он умеет:

- создавать отдельные git worktree и запускать несколько агентов параллельно;
- переиспользовать Codex homes, skills, плагины и кэши между запусками;
- подбирать готовое окружение для Rust, web или Python/uv и поддерживает свои конфиги;
- работать без сети, с allowlist или с обычной сетью;
- передавать секреты, SSH/GPG-agent, MCP, OAuth callbacks и локальные сервисы через отдельные мосты;
- сохранять сессии, переподключаться к ним и управлять worktree;
- ставиться одним скриптом, обновляться и проверять окружение через `doctor`.

Внутри — Rust, типизированный конфиг и довольно упоротый релизный пайплайн: Sigstore, vulnerability scanning, SBOM в SPDX и прочие вещи, которые модель решила добавить сразу. Базу почти целиком придумал и написал GPT‑5.6 Sol Ultra. Я потом добавил установщик, починил CI/CD и несколько недоработок — так получилась версия 0.1.6.

## До этого был pi-start

Первая версия называлась `pi-start`. Я написал её вокруг [pi](https://github.com/badlogic/pi-mono), когда дефолтный Codex меня окончательно заебал.

<ChatThread label="Мои сообщения о первой версии pi-start">
	<div class="chat-row">
		<img class="chat-avatar" src="avatar.webp" alt="Аватар cofob" />
		<div class="chat-bubble">
			<p class="chat-author">cofob</p>
			<p class="chat-text">меня заебал дефолтный кодекс и я заебошил норм враппер вокруг pi, который делает окружение без сети внутри докера с отдельным git worktree</p>
		</div>
	</div>
	<div class="chat-row">
		<img class="chat-avatar" src="avatar.webp" alt="" />
		<div class="chat-bubble">
			<p class="chat-text">сами пресеты — просто набор sh-файлов и докерфайлов
всё настраивается
но код правда это вайб на баше
ужасный)
но работает</p>
		</div>
	</div>
	<div class="chat-row">
		<img class="chat-avatar" src="avatar.webp" alt="" />
		<div class="chat-bubble">
			<p class="chat-text">между сессиями реюзается pi полностью, можно ставить любые аддоны
шарится кэш для раста и uv
а так как агенты в отдельных worktree, их можно запускать сколько угодно параллельно</p>
		</div>
	</div>
</ChatThread>

Получилось около тысячи строк bash. Потом понадобилось больше функций, код вырос до 2,5 тысяч строк и поддерживать его стало неприятно, хотя свою задачу он решал.

<AsciinemaPlayer
	src="https://site-assets.cofob.dev/codex-start/pi-start.cast"
	cols={200}
	rows={56}
	label="Демонстрация pi-start в терминале"
/>

А вот [тот самый вайбкод](https://gist.github.com/cofob/4c9a7e2fdd71410fae65005633378a5c).

С выходом GPT‑5.6 Sol Ultra захотелось проверить его на реальной задаче и заодно наконец нормально закрыть изоляцию Codex. Так `pi-start` превратился в `codex-start`.
