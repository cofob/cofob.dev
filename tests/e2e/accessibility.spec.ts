import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of ["/", "/blog/", "/blog/example-post/"]) {
	test(`${path} has no automated accessibility violations`, async ({ page }) => {
		await page.goto(path);
		const results = await new AxeBuilder({ page }).analyze();
		expect(results.violations).toEqual([]);
	});
}

test("skip navigation and static comment consent are keyboard accessible", async ({ page }) => {
	await page.goto("/");
	await page.keyboard.press("Tab");
	const skipLink = page.getByRole("link", { name: "Skip to main content" });
	await expect(skipLink).toBeFocused();
	await page.keyboard.press("Enter");
	await expect(page.locator("#main-content")).toBeFocused();

	await page.goto("/blog/example-post/");
	await expect(page.getByRole("button", { name: "Load comments" })).toBeVisible();
});
