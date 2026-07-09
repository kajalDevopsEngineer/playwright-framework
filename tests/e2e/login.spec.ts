import { test } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

test('user can login with valid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  const dashboardPage = new DashboardPage(page);

  await test.step('Open login page', async () => {
    await loginPage.open();
  });

  await test.step('Login with valid credentials', async () => {
    await loginPage.login('Admin', 'admin123');
  });

  await test.step('Verify dashboard is visible', async () => {
    await dashboardPage.expectDashboardVisible();
  });
});