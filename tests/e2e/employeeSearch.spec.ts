import { test, expect } from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { EmployeeListPage } from '../../src/pages/EmployeeListPage';

test.describe('Employee List', () => {
  let loginPage: LoginPage;
  let dashboardPage: DashboardPage;
  let employeeListPage: EmployeeListPage;

  test.beforeEach(async ({ page }) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    employeeListPage = new EmployeeListPage(page);

    await loginPage.open();
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.expectDashboardVisible();
    await dashboardPage.navBar.goToPIM();
  });

  // Smoke - basic search working is critical
  test('user can search for an employee by name @smoke',
    async () => {
      await employeeListPage.searchByName('Admin');
      await employeeListPage.expectResultsVisible();
    }
  );

  // Regression only - edge case, not critical path
  test('user sees no records for a non-existent employee @regression',
    async () => {
      await employeeListPage.searchByName('ZZZNonExistentName');
      await employeeListPage.expectNoRecordsFound();
    }
  );

});