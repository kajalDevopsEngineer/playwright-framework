import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Limit parallel workers on CI, use default locally
  workers: process.env.CI ? 2 : undefined,

  // Reporter to use
  reporter: 'html',

  use: {
    // Base URL so tests can use relative paths like page.goto('/web/index.php/auth/login')
    baseURL: 'https://opensource-demo.orangehrmlive.com',

    // Collect trace when retrying the failed test
    trace: 'on-first-retry',

    // Take screenshot only when test fails
    screenshot: 'only-on-failure',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});