import { test, expect } from '../../src/fixtures';
import { NetworkMocks } from '../../src/utils/networkMocks';

test.describe('Network mocking scenarios', () => {

  test.afterEach(async ({ page }) => {
    await new NetworkMocks(page).clearAllMocks();
  });

  test(
    'employee search shows no results when API returns empty data @regression',
    async ({ authenticatedPage, employeeListPage }) => {
      const networkMocks = new NetworkMocks(authenticatedPage);

      // Mock AFTER navigation - intercepts the search API call
      await networkMocks.mockEmptyResponse(
        '**/api/v2/pim/employees**'
      );

      await employeeListPage.searchByName('Admin');
      await employeeListPage.expectNoRecordsFound();
    }
  );

  test(
    'page handles slow API response gracefully @regression',
    async ({ authenticatedPage, employeeListPage }) => {
      const networkMocks = new NetworkMocks(authenticatedPage);

      // Mock the search specifically - not the navigation call
      // Route pattern scoped to search requests only
      await networkMocks.mockSlowResponse(
        '**/api/v2/pim/employees?**',
        2000
      );

      await employeeListPage.searchByName('Admin');
      await employeeListPage.expectResultsVisible();
    }
  );
});