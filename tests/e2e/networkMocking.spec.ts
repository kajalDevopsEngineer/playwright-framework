import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { EmployeeListPage } from '../../src/pages/EmployeeListPage';
import { NetworkMocks } from '../../src/utils/networkMocks';

test.describe('Network mocking scenarios', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let employeeListPage: EmployeeListPage;
  let networkMocks: NetworkMocks;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    employeeListPage = new EmployeeListPage(page);
    networkMocks = new NetworkMocks(page);

    // Login first - mocks apply AFTER login
    await loginPage.open();
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.expectDashboardVisible();
    await dashboardPage.navBar.goToPIM();
  });

  test.afterEach(async () => {
    // Always clear mocks after each test
    // so they don't bleed into subsequent tests
    await networkMocks.clearAllMocks();
  });

  test(
    'employee search shows no results when API returns empty data @regression',
    async ({ page }) => {
      // Intercept the employee search API and return empty data
      // This tests the "no results" UI state without needing
      // an empty database
      await networkMocks.mockEmptyResponse(
        '**/api/v2/pim/employees**'
      );

      await employeeListPage.searchByName('Admin');

      // The UI should show "No Records Found" even though
      // "Admin" employees exist - because we mocked the API
      await employeeListPage.expectNoRecordsFound();
    }
  );

  test(
    'page handles slow API response gracefully @regression',
    async ({ page }) => {
      // Simulate a slow server response (2 seconds)
      await networkMocks.mockSlowResponse(
        '**/api/v2/pim/employees**',
        2000
      );

      await employeeListPage.searchByName('Admin');

      // With our 30 second timeout, this should still pass
      // even with the 2 second delay
      await employeeListPage.expectResultsVisible();
    }
  );
});