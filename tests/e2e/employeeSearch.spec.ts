import { test } from '@playwright/test';
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

    // Login and navigate to Employee List before each test
    await loginPage.open();
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.expectDashboardVisible();
    await dashboardPage.navBar.goToPIM();
  });

  test('user can search for an employee by name', async () => {
    await employeeListPage.searchByName('Admin');
    await employeeListPage.expectResultsVisible();
  });

  test('user sees no records for a non-existent employee', async () => {
    await employeeListPage.searchByName('ZZZNonExistentName');
    await employeeListPage.expectNoRecordsFound();
  });
});