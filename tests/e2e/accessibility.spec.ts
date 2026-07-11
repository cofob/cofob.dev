import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";

for (const path of ["/", "/blog/", "/blog/example-post/", "/license/"]) {
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

test("structured data is valid JSON on site and article pages", async ({ page }) => {
	for (const path of ["/", "/blog/", "/blog/example-post/"]) {
		await page.goto(path);
		const documents = await page.locator('script[type="application/ld+json"]').allTextContents();
		expect(documents.length).toBeGreaterThan(0);
		for (const document of documents) expect(() => JSON.parse(document)).not.toThrow();
	}
});

test("license terms and machine-readable metadata are exposed", async ({ page }) => {
	await page.goto("/license/");
	await expect(page.getByRole("heading", { level: 1, name: "cofob.dev License" })).toBeVisible();
	await expect(page.getByText("Original cofob.dev source code and website content", { exact: false })).toBeVisible();
	await expect(page.getByText("source code, software, documentation, website content", { exact: false })).toBeVisible();
	await expect(page.getByText("may not use the covered material to train", { exact: false })).toBeVisible();
	await expect(page.locator('link[rel="license"]')).toHaveAttribute("href", "https://cofob.dev/license/");
});
