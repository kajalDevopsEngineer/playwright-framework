import {
  test,
  expect,
  request,
  APIRequestContext,
  chromium,
} from '@playwright/test';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';
import { EmployeeListPage } from '../../src/pages/EmployeeListPage';
import { APIClient } from '../../src/api/APIClient';
import { createEmployeeData } from '../../src/data/employeeFactory';

const BASE_URL =
  'https://opensource-demo.orangehrmlive.com';
const STORAGE_STATE = 'test-results/auth-state.json';

test.describe('Employee management with API setup', () => {
  let apiClient: APIClient;
  let requestContext: APIRequestContext;
  let createdEmployee: any;

  // ─── ONE-TIME SETUP ───────────────────────────────
  test.beforeAll(async () => {
    // Authenticate via browser, save state for API use
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page
      .getByRole('heading', { name: 'Dashboard' })
      .waitFor();

    await context.storageState({ path: STORAGE_STATE });
    await browser.close();

    // Create API client with saved auth
    requestContext = await request.newContext({
      baseURL: BASE_URL,
      storageState: STORAGE_STATE,
    });
    apiClient = new APIClient(requestContext, BASE_URL);
  });

  // ─── PER-TEST SETUP ───────────────────────────────
  test.beforeEach(async () => {
    // Create fresh employee data for this test
    const employeeData = createEmployeeData({
      firstName: 'Automation',
      lastName: 'TestUser',
    });

    console.log(
      `Creating employee: ${employeeData.firstName} ${employeeData.lastName}`
    );

    // Create the employee via API - fast, no UI needed
    createdEmployee = await apiClient.createEmployee(
      employeeData.firstName,
      employeeData.lastName,
      employeeData.employeeId
    );

    console.log(
      `Employee created with ID: ${createdEmployee.empNumber}`
    );
  });

  // ─── PER-TEST TEARDOWN ────────────────────────────
  test.afterEach(async () => {
    // Always clean up, even if the test failed
    if (createdEmployee?.empNumber) {
      console.log(
        `Cleaning up employee: ${createdEmployee.empNumber}`
      );
      await apiClient.deleteEmployee(createdEmployee.empNumber);
    }
  });

  // ─── ONE-TIME CLEANUP ─────────────────────────────
  test.afterAll(async () => {
    await requestContext.dispose();
  });

  // ─── THE ACTUAL TESTS ─────────────────────────────

  test('newly created employee appears in search results', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeeListPage = new EmployeeListPage(page);

    // UI test starts here - employee already exists thanks to beforeEach
    await loginPage.open();
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.expectDashboardVisible();
    await dashboardPage.navBar.goToPIM();

    // Search for the exact employee we created via API
    await employeeListPage.searchByName(
      createdEmployee.firstName
    );
    await employeeListPage.expectResultsVisible();
  });

  test('deleted employee does not appear in search', async ({
    page,
  }) => {
    const loginPage = new LoginPage(page);
    const dashboardPage = new DashboardPage(page);
    const employeeListPage = new EmployeeListPage(page);

    // Delete via API first
    await apiClient.deleteEmployee(createdEmployee.empNumber);

    // Then verify via UI it's gone
    await loginPage.open();
    await loginPage.login('Admin', 'admin123');
    await dashboardPage.expectDashboardVisible();
    await dashboardPage.navBar.goToPIM();

    await employeeListPage.searchByName(
      createdEmployee.firstName
    );
    await employeeListPage.expectNoRecordsFound();

    // Set to null so afterEach doesn't try to delete again
    createdEmployee = null;
  });
});