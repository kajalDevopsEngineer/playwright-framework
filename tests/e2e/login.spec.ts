import { test, expect } from '../../src/fixtures';

test('user can login with valid credentials @smoke @critical',
  async ({ page }) => {
    // Login test uses raw page - it's testing login itself
    // so it can't use authenticatedPage fixture
    // (that fixture already assumes login worked)
    const { LoginPage } = await import('../../src/pages/LoginPage');
    const { DashboardPage } = await import('../../src/pages/DashboardPage');

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
  }
);