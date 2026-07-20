---
title: "codex-start: Codex в отдельном контейнере"
description: "Codex в изолированном Docker-окружении с отдельными git worktree."
published: 2026-07-10T18:00:00+00:00
lang: ru
tags: [vibecoding, project]
draft: false
---

<script>
	import AsciinemaPlayer from "$lib/components/blog/AsciinemaPlayer.svelte";
	import ChatThread from "$lib/components/blog/ChatThread.svelte";
	import NoticeBlock from "$lib/components/blog/NoticeBlock.svelte";
	import Sticker from "$lib/components/blog/Sticker.svelte";
	import WarningBlock from "$lib/components/blog/WarningBlock.svelte";

	const piStartMessages = [
		{
			text: "меня заебал дефолтный кодекс и я заебошил норм враппер вокруг pi, который делает окружение без сети внутри докера с отдельным git worktree",
		},
		{
			text: "сами пресеты это просто набор sh файлов и докефайлов\nвсе настраиватся\nно код правда это вайб на баше\nужасный)\nно работает",
		},
		{
			link: "https://gist.github.com/cofob/4c9a7e2fdd71410fae65005633378a5c",
			text: "вот если что код",
		},
		{
			text: "между сессиями реюзается pi полностью, можно ставить в него любые аддоны, они будут работать\nтакже шарится кэш для раста например или для uv",
		},
		{ text: "в теории прокидывается еще и ssh-agent/gpg-agent, но чет сломалось(" },
		{ text: "ну и так как агенты в отдельных worktree то можно запускать сколько угодно их параллельно" },
	];
</script>

<WarningBlock>
	Это вайбкод. Я писал его исключительно для себя и своих задач и не гарантирую, что у вас он вообще будет работать.
	<Sticker
		src="/stickers/the-gates-of-orgrimmar/zavali_ebalo.webp"
		alt="Стикер из пака The Gates of Orgrimmar"
		sourceName="стикерпак The Gates of Orgrimmar"
		sourceUrl="https://t.me/addstickers/the_gates_of_orgrimmar"
	/>
</WarningBlock>

У Codex мало ограничений по умолчанию, он может читать почти все, он может писать в проектную папку, он может выполнять команды без сети. Ну и конечно он очень любит случайно читать секреты)

Я с помощью него восстанавливал данные из restic бэкапа, потому что у рестика CLI не очень удобный. Для удобства я держу wrapper-shell файлы которые прокидывают внутрь рестика секреты для шифрования и доступа до бэкап-репозитория. Попросил кодекс найти и восстановить файл, сказал какой файл нужно вызывать для доступа к данным, ну и конечно же он пошел его и прочитал. По сути отправил все мои секреты на сервера OpenAI.
Очень верю в то что опенаи это корпорация добра, примерно как Google и что они надежно сохранят эти данные у себя на серверах, во благо человечества. Но секреты ротировать все же пришлось.

У меня уже давно висела в голове идея изолировать этих агентов, чтобы во первых избежать подобных ситуаций, ну и в качестве плюса можно им дать возможность запускать любые команды без ограничений (способы навредить все еще останутся, но вероятность такого будет ниже).

Хотелось утилиту, которая сама менеджит worktree и позволяет агентам внутри работать без human approvals вообще, поэтому я сделал <a href="https://github.com/cofob/codex-start" target="_blank" rel="noopener noreferrer">codex-start</a>.

![Схема двух изолированных worktree Codex в Docker с SSH, .git и ~/.config](visualization.webp)

Сейчас он запускает полноценный Codex в воспроизводимых Docker или Podman-окружениях, сам создаёт отдельные git worktree и позволяет запускать сколько угодно агентов параллельно. Есть готовые окружения для Rust, web и uv, переиспользование Codex homes и кэшей, управление сессиями, allowlist для сети и прокидывание секретов, SSH/GPG-agent, MCP и локальных сервисов.

<AsciinemaPlayer
	src="codex-start-demo.cast"
	label="Демонстрация codex-start в терминале"
/>

<NoticeBlock>
	Справедливости ради я попробовал настроить sandboxing средствами самого Codex, но не смог достичь желаемого результата. Правила были либо слишком слабые, либо слишком сильные и мешали работать.
	<Sticker
		src="/stickers/the-gates-of-orgrimmar/ya_ne_dolboeb.webp"
		alt="Стикер из пака The Gates of Orgrimmar в примечании"
		sourceName="стикерпак The Gates of Orgrimmar"
		sourceUrl="https://t.me/addstickers/the_gates_of_orgrimmar"
	/>
</NoticeBlock>

Код написал GPT‑5.6 Sol Ultra. Я добавил инсталлятор, починил CI/CD и несколько недоработок, получилась версия 0.1.6.

## До этого был pi-start

Изначально я сделал `pi-start`. Вот что я писал о нём в чате:

<ChatThread
	author="cofob"
	avatar="avatar.webp"
	messages={piStartMessages}
	label="Мои сообщения о первой версии pi-start"
/>

Изначально это было около тысячи строк баша, но по мере добавления необходимого мне функционала оно выросло до 2,5 тысяч строк баша, что уже сложно мейнтейнить, но в целом оно работало.

<AsciinemaPlayer
	src="pi-start.cast"
	cols={200}
	rows={56}
	label="Демонстрация pi-start в терминале"
/>

С релизом GPT‑5.6 от OpenAI в Codex появился режим GPT‑5.6 Sol Ultra, который по сути включает у 5.6 Sol режим max thinking и добавляет промпт, чтобы он по максимуму использовал субагентов. `pi` в такой режим не умеет, поэтому я решил, во-первых, протестить GPT‑5.6 Sol Ultra на реальной задаче, а во-вторых закрыть проблему с изоляцией Codex. Поэтому я использовал Sol Ultra и написал `codex-start`.

Сама модель решила взять на себя много ответственности и придумала очень широкий функционал. Также решила сделать хороший (но бесполезный) тулинг вокруг, включая Sigstore для сборок, vulnerability scanning, SBOM/SPDX и так далее. У меня ушло, конечно, много времени потом на то, чтобы это всё запустить, но изначально база придумана неплохая.

<Sticker
	src="/stickers/fox_pack/ya_ahuenen.webp"
	alt="Стикер из пака PhSilver"
	sourceName="стикерпак PhSilver"
	sourceUrl="https://t.me/addstickers/PhSilver"
/>
