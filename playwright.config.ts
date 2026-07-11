import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 0 : 0,
  workers: process.env.CI ? 1 : 1,

  // Add this line
  globalTeardown: './src/utils/globalTeardown.ts',

  reporter: [
  ['line'],
  ['allure-playwright'],
],
  use: {
    baseURL:
      process.env.BASE_URL ||
      'https://opensource-demo.orangehrmlive.com',
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: !!process.env.CI,
    actionTimeout: 30000,
    navigationTimeout: 30000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});