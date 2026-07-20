<script lang="ts">
	import "@cofob/design-system-css/index.css";
	import { page } from "$app/state";
	import { resolve } from "$app/paths";
	import { replaceState } from "$app/navigation";
	import {
		AppShell,
		BlueLine,
		Footer,
		Navbar,
		SkipLink,
		ThemeProvider,
		ThemeScript,
		ThemeToggle,
		type LinkItem,
		type ThemePreference,
	} from "@cofob/design-system-svelte";
	import { onMount, type Snippet } from "svelte";
	import { SvelteURL } from "svelte/reactivity";
	import { lineRainbowStore } from "$lib/store";
	import { copyrightEmail, copyrightNotice, siteLicensePath, siteLicenseUrl } from "$lib/license";

	let { children }: { children: Snippet } = $props();
	let themePreference = $state<ThemePreference>();
	let navigationLinks = $derived<LinkItem[]>([
		{ label: "Blog", href: resolve("/blog"), current: page.url.pathname.startsWith(resolve("/blog")) },
		{ label: "PGP", href: resolve("/pgp"), current: page.url.pathname === resolve("/pgp") },
		{ label: "SSH", href: resolve("/keys"), current: page.url.pathname === resolve("/keys") },
	]);
	const footerGroups = [
		{
			title: "Feeds",
			links: [
				{ label: "RSS", href: resolve("/rss.xml") },
				{ label: "Atom", href: resolve("/atom.xml") },
			],
		},
		{
			title: "Project",
			links: [
				{ label: "Source code", href: "https://github.com/cofob/cofob.dev", external: true },
				{ label: "License", href: resolve(siteLicensePath) },
			],
		},
	] satisfies Array<{ title: string; links: LinkItem[] }>;

	onMount(() => {
		const storedTheme = localStorage.getItem("cf-theme");
		if (storedTheme === "system" || storedTheme === "light" || storedTheme === "dark") {
			themePreference = storedTheme;
		}

		const url = new SvelteURL(window.location.href);
		const hasRainbowQuery = url.searchParams.has("rainbow");
		const storedRainbow = sessionStorage.getItem("rainbow");

		if (hasRainbowQuery) {
			sessionStorage.setItem("rainbow", "1");
			lineRainbowStore.set(true);
		} else if (storedRainbow !== null) {
			lineRainbowStore.set(storedRainbow === "1");
		}

		if (hasRainbowQuery) {
			url.searchParams.delete("rainbow");
			// The URL is derived from the current page, not an application route literal.
			// eslint-disable-next-line svelte/no-navigation-without-resolve
			replaceState(url, page.state);
		}
	});
</script>

<svelte:head>
	<link rel="icon" type="image/x-icon" href="/static/favicon.ico" />
	<link rel="alternate" type="application/rss+xml" title="cofob.dev blog RSS" href="/rss.xml" />
	<link rel="alternate" type="application/atom+xml" title="cofob.dev blog Atom" href="/atom.xml" />
	<link rel="license" href={siteLicenseUrl} />
	<link rel="schema.dcterms" href="https://purl.org/dc/terms/" />
	<meta name="dcterms.rights" content={copyrightNotice} />
</svelte:head>

<ThemeScript />
{#snippet brandContent()}<BlueLine rainbow={$lineRainbowStore}>cofob</BlueLine>{/snippet}
{#snippet themeAction()}
	<ThemeToggle
		preference={themePreference ?? "system"}
		onPreferenceChange={(preference) => (themePreference = preference)}
	/>
{/snippet}

<ThemeProvider bind:preference={themePreference}>
	<AppShell>
		<SkipLink>Skip to main content</SkipLink>
		<Navbar
			brand="cofob"
			brandHref={resolve("/")}
			{brandContent}
			links={navigationLinks}
			actions={themeAction}
			collapseAt="tablet"
		/>

		<main id="main-content" tabindex="-1">
			{@render children()}
		</main>

		<Footer
			brand="cofob.dev"
			description={`Contact: ${copyrightEmail}`}
			groups={footerGroups}
			copyright={copyrightNotice}
		/>
	</AppShell>
</ThemeProvider>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- trusted deployment-controlled analytics markup -->
{@html import.meta.env.VITE_ANALYTICS}
