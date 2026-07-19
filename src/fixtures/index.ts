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

  /**
   * authenticatedPage fixture
   * Provides a browser page that's already logged in.
   * Login happens via UI once, state is shared.
   */
  authenticatedPage: async ({ page }, use) => {
    // SETUP - runs before the test
    const loginPage = new LoginPage(page);
    await loginPage.open();
    await loginPage.login('Admin', 'admin123');

    // Wait for dashboard to confirm login succeeded
    const dashboardPage = new DashboardPage(page);
    await dashboardPage.expectDashboardVisible();

    // Hand the authenticated page to the test
    // Test runs here - everything between use() call
    await use(page);

    // TEARDOWN - runs after the test
    // (nothing needed here - page closes automatically)
  },

  /**
   * loginPage fixture
   * Provides a LoginPage instance tied to current page
   */
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },

  /**
   * dashboardPage fixture
   * Provides a DashboardPage instance tied to current page
   */
  dashboardPage: async ({ authenticatedPage }, use) => {
    // Notice: uses authenticatedPage, not page
    // So dashboardPage fixture automatically means logged in
    await use(new DashboardPage(authenticatedPage));
  },

  /**
   * employeeListPage fixture
   * Provides EmployeeListPage + navigates to PIM automatically
   */
  employeeListPage: async ({ authenticatedPage, dashboardPage }, use) => {
    // Navigate to PIM as part of fixture setup
    await dashboardPage.navBar.goToPIM();
    await use(new EmployeeListPage(authenticatedPage));
  },

});

// Re-export expect so tests only need one import
export { expect } from '@playwright/test';