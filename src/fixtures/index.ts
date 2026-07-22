import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';
import { env } from '../config/environments';

type CustomFixtures = {
  authenticatedPage: Page;
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeeListPage: EmployeeListPage;
};

export const test = base.extend<CustomFixtures>({

  authenticatedPage: async ({ page }, use) => {
    page.setDefaultTimeout(env.timeouts.action);
    page.setDefaultNavigationTimeout(env.timeouts.navigation);

    const loginPage = new LoginPage(page);
    await loginPage.open();

    // Use credentials from environment config
    // No hardcoded credentials in test code
    await loginPage.login(
      env.credentials.username,
      env.credentials.password
    );

    await page.waitForURL('**/dashboard/**', {
      timeout: env.timeouts.navigation,
    });

    const dashboardPage = new DashboardPage(page);
    await dashboardPage.expectDashboardVisible();

    await use(page);
  },

  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  dashboardPage: async ({ authenticatedPage }, use) => {
    await use(new DashboardPage(authenticatedPage));
  },

  employeeListPage: async ({ authenticatedPage, dashboardPage }, use) => {
    await dashboardPage.navBar.goToPIM();
    await authenticatedPage.waitForURL('**/pim/**', {
      timeout: env.timeouts.navigation,
    });
    await authenticatedPage.waitForLoadState('domcontentloaded');
    await authenticatedPage.waitForTimeout(2000);
    await use(new EmployeeListPage(authenticatedPage));
  },
});

export { expect } from '@playwright/test';