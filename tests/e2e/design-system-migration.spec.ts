import { expect, test } from "@playwright/test";

async function visibleThemeToggle(page: import("@playwright/test").Page) {
	const toggle = page.locator(".cf-theme-toggle");
	if (!(await toggle.isVisible())) await page.locator("[data-cf-navbar-trigger]").click();
	await expect(toggle).toBeVisible();
	return toggle;
}

async function waitForHydration(page: import("@playwright/test").Page) {
	await expect.poll(() => page.evaluate(() => localStorage.getItem("cf-theme"))).not.toBeNull();
}

test("theme preference cycles and persists across reloads", async ({ page }) => {
	await page.goto("/");
	await page.evaluate(() => localStorage.removeItem("cf-theme"));
	await page.reload();
	await waitForHydration(page);

	let toggle = await visibleThemeToggle(page);
	await expect(toggle).toHaveAttribute("data-preference", "system");
	await toggle.click();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "light");
	await expect.poll(() => page.evaluate(() => localStorage.getItem("cf-theme"))).toBe("light");

	await page.reload();
	toggle = await visibleThemeToggle(page);
	await expect(toggle).toHaveAttribute("data-preference", "light");
	await expect(page.locator("html")).toHaveAttribute("data-theme", "light");

	await toggle.click();
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
	await page.reload();
	toggle = await visibleThemeToggle(page);
	await expect(toggle).toHaveAttribute("data-preference", "dark");
	await expect(page.locator("html")).toHaveAttribute("data-theme", "dark");
});

test("mobile navbar opens and remains keyboard operable", async ({ page }, testInfo) => {
	test.skip(testInfo.project.name !== "mobile", "The disclosure is shown only at mobile widths.");
	await page.goto("/");
	await waitForHydration(page);

	const trigger = page.locator("[data-cf-navbar-trigger]");
	await expect(trigger).toBeVisible();
	await trigger.focus();
	await page.keyboard.press("Enter");
	await expect(page.locator("[data-cf-navbar]")).toHaveAttribute("data-state", "open");
	await expect(page.getByRole("link", { name: "Blog" })).toBeVisible();

	await page.keyboard.press("Escape");
	await expect(page.locator("[data-cf-navbar]")).toHaveAttribute("data-state", "closed");
});

test("blog search and tag filtering preserve their behavior", async ({ page }) => {
	await page.goto("/blog/");
	await waitForHydration(page);
	await page.getByLabel("Search posts").fill("vibecoding");
	await expect(page.getByText("1 result", { exact: true })).toBeVisible();
	const result = page.locator(".cf-search-result-card");
	await expect(result).toContainText("codex-start");
	await expect(result.locator("mark")).toContainText("vibecoding");

	await page.getByLabel("Search posts").fill("");
	const filters = page.getByRole("navigation", { name: "Filter posts by tag" });
	await filters.getByRole("link", { name: "3D printing" }).click();
	await expect(page).toHaveURL(/tag=3D(?:%20|\+)printing/);
	await expect(page.getByText("Showing 1 of 1 posts", { exact: true })).toBeVisible();
	await expect(page.locator(".cf-post-card")).toContainText("Bambu Lab P2S");
});

test("representative pages do not create page-level overflow", async ({ page }) => {
	for (const path of ["/", "/blog/", "/blog/codex-start/", "/blog/example-post/", "/license/"]) {
		await page.goto(path);
		await expect
			.poll(() => page.evaluate(() => document.documentElement.scrollWidth <= document.documentElement.clientWidth))
			.toBe(true);
	}
});

for (const theme of ["light", "dark"] as const) {
	test(`@visual home page has an intentional ${theme} DS snapshot`, async ({ page }) => {
		await page.emulateMedia({ colorScheme: theme, reducedMotion: "reduce" });
		await page.goto("/");
		await page.evaluate((preference) => localStorage.setItem("cf-theme", preference), theme);
		await page.reload();
		await expect(page.locator("html")).toHaveAttribute("data-theme", theme);
		await page.evaluate(() => document.fonts.ready);
		await expect(page).toHaveScreenshot(`home-${theme}.png`, {
			animations: "disabled",
			fullPage: true,
		});
	});
}
