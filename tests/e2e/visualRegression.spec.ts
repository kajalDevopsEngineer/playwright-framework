import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

test.describe('Visual regression tests', () => {

  test('login page matches baseline screenshot @regression',
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.open();
      await page.waitForLoadState('domcontentloaded');

      // Small wait for any animations to settle
      await page.waitForTimeout(1000);

      await expect(page).toHaveScreenshot('login-page.png', {
        maxDiffPixelRatio: 0.05,
        mask: [
          page.locator('.oxd-topbar-header-usericon'),
        ],
      });
    }
  );

 test('dashboard matches baseline screenshot @regression',
  async ({ page }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);

    await loginPage.open();
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.expectDashboardVisible();

    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(3000);

    await expect(page).toHaveScreenshot('dashboard.png', {
      maxDiffPixelRatio: 0.15,
      // Only mask the user avatar - shows dynamic username
      // Don't mask the whole content area
      mask: [
        page.locator('.oxd-userdropdown-img'),
        page.locator('.oxd-topbar-header-usericon'),
      ],
      timeout: 20000,
    });
  }
);
});