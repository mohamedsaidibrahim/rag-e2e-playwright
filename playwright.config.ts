import { defineConfig, devices } from "@playwright/test";

const BASE_URL = process.env.BASE_URL || "http://localhost:8000";

export default defineConfig({
  testDir: "./tests",
  timeout: 180000,
  expect: { timeout: 30000 },
  reporter: [
    ["list"],
    ["allure-playwright"],
    ["html", { open: "never" }],
  ],
  use: {
    baseURL: BASE_URL,
    trace: "retain-on-failure",
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    actionTimeout: 30000,
    navigationTimeout: 60000,
  },
  projects: [
    {
      name: "chromium",
      use: { ...devices["Desktop Chrome"] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    }
  ],
  workers: 1,
  globalTeardown: "./global-teardown.js",
});
