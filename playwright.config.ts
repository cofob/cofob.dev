import { defineConfig } from "@playwright/test";

export default defineConfig({
	testDir: "tests/e2e",
	fullyParallel: true,
	reporter: "list",
	use: {
		baseURL: "http://127.0.0.1:4173",
		trace: "retain-on-failure",
	},
	projects: [
		{ name: "desktop", use: { browserName: "chromium", viewport: { width: 1280, height: 800 } } },
		{ name: "mobile", use: { browserName: "chromium", viewport: { width: 375, height: 812 } } },
	],
	webServer: {
		command: "COMMENTS_MODE=manual npm run dev -- --host 127.0.0.1 --port 4173",
		url: "http://127.0.0.1:4173",
		reuseExistingServer: true,
		timeout: 30_000,
	},
});
