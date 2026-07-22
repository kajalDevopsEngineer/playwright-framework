import { defineConfig, devices } from '@playwright/test';
import { env } from './src/config/environments';

export default defineConfig({
  testDir: './tests',
  fullyParallel: false,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : 1,
  globalTeardown: './src/utils/globalTeardown.ts',
  timeout: env.timeouts.test,

  reporter: [
    ['line'],
    ['allure-playwright'],
  ],

  use: {
    baseURL: env.baseURL,
    trace: 'on-first-retry',
    screenshot: 'only-on-failure',
    headless: !!process.env.CI,
    actionTimeout: env.timeouts.action,
    navigationTimeout: env.timeouts.navigation,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});