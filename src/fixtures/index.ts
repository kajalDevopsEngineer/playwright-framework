import { test as base, Page } from '@playwright/test';
import { LoginPage } from '../pages/LoginPage';
import { DashboardPage } from '../pages/DashboardPage';
import { EmployeeListPage } from '../pages/EmployeeListPage';

/**
 * Define the shape of our custom fixtures.
 * This tells TypeScript exactly what our fixtures provide.
 */
type CustomFixtures = {
  // A page that's already authenticated
  authenticatedPage: Page;
  // Pre-built page objects ready to use
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  employeeListPage: EmployeeListPage;
};

/**
 * Extend Playwright's base test with our custom fixtures.
 * Every test that imports from this file gets access
 * to authenticatedPage, loginPage, dashboardPage etc.
 */
export const test = base.extend<CustomFixtures>({

  authenticatedPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('Admin', 'admin123');

    // Wait for URL redirect to complete
    await page.waitForURL('**/dashboard/**', { timeout: 45000 });

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

    // Wait for PIM page to fully load
    await authenticatedPage.waitForURL('**/pim/**', { timeout: 45000 });
    await authenticatedPage.waitForLoadState('domcontentloaded');
    await authenticatedPage.waitForTimeout(2000);

    await use(new EmployeeListPage(authenticatedPage));
  },
});

// Re-export expect so tests only need one import
export { expect } from '@playwright/test';