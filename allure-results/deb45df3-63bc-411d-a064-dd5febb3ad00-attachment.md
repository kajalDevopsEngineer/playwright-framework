# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\employeeWithApiSetup.spec.ts >> Employee management with API setup >> newly created employee appears in search results
- Location: tests\e2e\employeeWithApiSetup.spec.ts:91:7

# Error details

```
"beforeAll" hook timeout of 30000ms exceeded.
```

```
TypeError: Cannot read properties of undefined (reading 'dispose')
```

# Test source

```ts
  1   | import {
  2   |   test,
  3   |   expect,
  4   |   request,
  5   |   APIRequestContext,
  6   |   chromium,
  7   | } from '@playwright/test';
  8   | import { LoginPage } from '../../src/pages/LoginPage';
  9   | import { DashboardPage } from '../../src/pages/DashboardPage';
  10  | import { EmployeeListPage } from '../../src/pages/EmployeeListPage';
  11  | import { APIClient } from '../../src/api/APIClient';
  12  | import { createEmployeeData } from '../../src/data/employeeFactory';
  13  | 
  14  | const BASE_URL =
  15  |   'https://opensource-demo.orangehrmlive.com';
  16  | const STORAGE_STATE = 'test-results/auth-state.json';
  17  | 
  18  | test.describe('Employee management with API setup', () => {
  19  |   let apiClient: APIClient;
  20  |   let requestContext: APIRequestContext;
  21  |   let createdEmployee: any;
  22  | 
  23  |   // ─── ONE-TIME SETUP ───────────────────────────────
  24  |   test.beforeAll(async () => {
  25  |     // Authenticate via browser, save state for API use
  26  |     const browser = await chromium.launch();
  27  |     const context = await browser.newContext();
  28  |     const page = await context.newPage();
  29  | 
  30  |     await page.goto(`${BASE_URL}/web/index.php/auth/login`);
  31  |     await page.getByPlaceholder('Username').fill('Admin');
  32  |     await page.getByPlaceholder('Password').fill('admin123');
  33  |     await page.getByRole('button', { name: 'Login' }).click();
  34  |     await page
  35  |       .getByRole('heading', { name: 'Dashboard' })
  36  |       .waitFor();
  37  | 
  38  |     await context.storageState({ path: STORAGE_STATE });
  39  |     await browser.close();
  40  | 
  41  |     // Create API client with saved auth
  42  |     requestContext = await request.newContext({
  43  |       baseURL: BASE_URL,
  44  |       storageState: STORAGE_STATE,
  45  |     });
  46  |     apiClient = new APIClient(requestContext, BASE_URL);
  47  |   });
  48  | 
  49  |   // ─── PER-TEST SETUP ───────────────────────────────
  50  |   test.beforeEach(async () => {
  51  |     // Create fresh employee data for this test
  52  |     const employeeData = createEmployeeData({
  53  |       firstName: 'Automation',
  54  |       lastName: 'TestUser',
  55  |     });
  56  | 
  57  |     console.log(
  58  |       `Creating employee: ${employeeData.firstName} ${employeeData.lastName}`
  59  |     );
  60  | 
  61  |     // Create the employee via API - fast, no UI needed
  62  |     createdEmployee = await apiClient.createEmployee(
  63  |       employeeData.firstName,
  64  |       employeeData.lastName,
  65  |       employeeData.employeeId
  66  |     );
  67  | 
  68  |     console.log(
  69  |       `Employee created with ID: ${createdEmployee.empNumber}`
  70  |     );
  71  |   });
  72  | 
  73  |   // ─── PER-TEST TEARDOWN ────────────────────────────
  74  |   test.afterEach(async () => {
  75  |     // Always clean up, even if the test failed
  76  |     if (createdEmployee?.empNumber) {
  77  |       console.log(
  78  |         `Cleaning up employee: ${createdEmployee.empNumber}`
  79  |       );
  80  |       await apiClient.deleteEmployee(createdEmployee.empNumber);
  81  |     }
  82  |   });
  83  | 
  84  |   // ─── ONE-TIME CLEANUP ─────────────────────────────
  85  |   test.afterAll(async () => {
> 86  |     await requestContext.dispose();
      |                          ^ TypeError: Cannot read properties of undefined (reading 'dispose')
  87  |   });
  88  | 
  89  |   // ─── THE ACTUAL TESTS ─────────────────────────────
  90  | 
  91  |   test('newly created employee appears in search results', async ({
  92  |     page,
  93  |   }) => {
  94  |     const loginPage = new LoginPage(page);
  95  |     const dashboardPage = new DashboardPage(page);
  96  |     const employeeListPage = new EmployeeListPage(page);
  97  | 
  98  |     // UI test starts here - employee already exists thanks to beforeEach
  99  |     await loginPage.open();
  100 |     await loginPage.login('Admin', 'admin123');
  101 |     await dashboardPage.expectDashboardVisible();
  102 |     await dashboardPage.navBar.goToPIM();
  103 | 
  104 |     // Search for the exact employee we created via API
  105 |     await employeeListPage.searchByName(
  106 |       createdEmployee.firstName
  107 |     );
  108 |     await employeeListPage.expectResultsVisible();
  109 |   });
  110 | 
  111 |  test('deleted employee does not appear in search', async ({ page }) => {
  112 |   const loginPage = new LoginPage(page);
  113 |   const dashboardPage = new DashboardPage(page);
  114 |   const employeeListPage = new EmployeeListPage(page);
  115 | 
  116 |   // Delete via API first
  117 |   await apiClient.deleteEmployee(createdEmployee.empNumber);
  118 | 
  119 |   // Wait briefly for server to process deletion
  120 |   // OrangeHRM demo has eventual consistency - search index
  121 |   // takes a moment to reflect the deletion
  122 |   await page.waitForTimeout(2000);
  123 | 
  124 |   // Then verify via UI it's gone
  125 |   await loginPage.open();
  126 |   await loginPage.login('Admin', 'admin123');
  127 |   await dashboardPage.expectDashboardVisible();
  128 |   await dashboardPage.navBar.goToPIM();
  129 | 
  130 |   await employeeListPage.searchByName(createdEmployee.firstName);
  131 |   await employeeListPage.expectNoRecordsFound();
  132 | 
  133 |   createdEmployee = null;
  134 | });
  135 | });
```