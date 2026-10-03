import { defineConfig, devices } from "@playwright/test";
import process from "node:process";

export default defineConfig({
	forbidOnly: Boolean(process.env.CI),
	fullyParallel: true,
	outputDir: "test-results",
	reporter: process.env.CI ? "github" : "list",
	testDir: "./tests/e2e",
	use: {
		baseURL: "http://127.0.0.1:5173",
		trace: "retain-on-failure",
	},
	webServer: {
		command: "npm run dev -- --host 127.0.0.1 --port 5173 --strictPort",
		env: {
			VITE_APP_MODE: process.env.VITE_APP_MODE ?? "academic",
			VITE_BASE_PATH: process.env.VITE_BASE_PATH ?? "/",
		},
		url: "http://127.0.0.1:5173",
		reuseExistingServer: !process.env.CI,
		timeout: 30_000,
	},
	projects: [
		{
			name: "chromium-desktop",
			use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } },
		},
		{
			name: "chromium-mobile",
			use: { ...devices["Desktop Chrome"], viewport: { width: 360, height: 800 } },
		},
	],
});