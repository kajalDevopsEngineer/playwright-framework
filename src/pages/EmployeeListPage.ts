import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavBarComponent } from './components/NavBarComponent';

export class EmployeeListPage extends BasePage {
  private readonly employeeNameInput: Locator;
  private readonly searchButton: Locator;
  private readonly noRecordsText: Locator;
  private readonly tableRows: Locator;
  readonly navBar: NavBarComponent;

  constructor(page: Page) {
    super(page);

    // Search form locators
    this.employeeNameInput = page.getByRole('textbox', { name: 'Type for hints...' }).first();
    this.searchButton = page.getByRole('button', { name: 'Search' });
    this.noRecordsText = page.getByText(/no records found/i);
    this.tableRows = page.getByRole('row');

    // Shared nav component
    this.navBar = new NavBarComponent(page);
  }

  /**
   * Search for an employee by name
   */
  async searchByName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    await this.searchButton.click();
  }

  /**
   * Assert at least one result row is visible in the table
   */
  async expectResultsVisible(): Promise<void> {
    await expect(this.tableRows.first()).toBeVisible();
  }

  /**
   * Assert no records message is shown
   */
  async expectNoRecordsFound(): Promise<void> {
    await expect(this.noRecordsText).toBeVisible();
  }
}