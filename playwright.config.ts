import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  globalTeardown: './src/utils/globalTeardown.ts',

  // Increase overall test timeout for CI/Docker
  timeout: process.env.CI ? 90000 : 60000,

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
    actionTimeout: 45000,
    navigationTimeout: 45000,
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});