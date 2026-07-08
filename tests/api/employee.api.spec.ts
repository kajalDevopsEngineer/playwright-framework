import {
  test,
  expect,
  request,
  APIRequestContext,
  chromium,
} from '@playwright/test';
import { APIClient } from '../../src/api/APIClient';

const BASE_URL =
  'https://opensource-demo.orangehrmlive.com';
const STORAGE_STATE_PATH = 'test-results/auth-state.json';

test.describe('Employee API', () => {
  let apiClient: APIClient;
  let requestContext: APIRequestContext;

  test.beforeAll(async () => {
    // Step 1: Launch a real browser and login through the UI
    // This handles all CSRF, cookies, redirects automatically
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();

    await page.goto(`${BASE_URL}/web/index.php/auth/login`);
    await page.getByPlaceholder('Username').fill('Admin');
    await page.getByPlaceholder('Password').fill('admin123');
    await page.getByRole('button', { name: 'Login' }).click();
    await page.getByRole('heading', { name: 'Dashboard' }).waitFor();

    // Step 2: Save the authenticated browser state to a file
    // This captures all cookies and localStorage
    await context.storageState({ path: STORAGE_STATE_PATH });
    console.log('Auth state saved successfully');

    await browser.close();

    // Step 3: Create API request context using the saved auth state
    // Now every API call carries the same cookies the browser had
    requestContext = await request.newContext({
      baseURL: BASE_URL,
      storageState: STORAGE_STATE_PATH,
    });

    apiClient = new APIClient(requestContext, BASE_URL);
  });

  test.afterAll(async () => {
    await requestContext.dispose();
  });

  test('GET /employees returns a list', async () => {
    const employees = await apiClient.getEmployees();

    expect(Array.isArray(employees)).toBe(true);
    expect(employees.length).toBeGreaterThan(0);

    console.log(`Total employees: ${employees.length}`);
  });

  test('GET /employees returns objects with expected fields', async () => {
    const employees = await apiClient.getEmployees();
    const first = employees[0];

    expect(first).toHaveProperty('empNumber');
    expect(first).toHaveProperty('firstName');
    expect(first).toHaveProperty('lastName');

    console.log('First employee:', JSON.stringify(first, null, 2));
  });
});