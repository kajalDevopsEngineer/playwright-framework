import { test, expect } from '../../src/fixtures';

test.describe('Employee List', () => {

  test('user can search for an employee by name @smoke',
    async ({ employeeListPage }) => {
      // employeeListPage fixture already:
      // 1. Logged in
      // 2. Navigated to PIM
      // Ready to search immediately
      await employeeListPage.searchByName('Admin');
      await employeeListPage.expectResultsVisible();
    }
  );

  test('user sees no records for a non-existent employee @regression',
    async ({ employeeListPage }) => {
      await employeeListPage.searchByName('ZZZNonExistentName');
      await employeeListPage.expectNoRecordsFound();
    }
  );
});