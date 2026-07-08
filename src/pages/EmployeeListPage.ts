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

    this.employeeNameInput = page.getByPlaceholder('Type for hints...');
    this.searchButton = page.getByRole('button', { name: 'Search' });

    // Scope specifically to the span in the results table
    // not the toast notification which also shows "No Records Found"
    this.noRecordsText = page.locator('span').filter({
      hasText: /^No Records Found$/,
    });

    this.tableRows = page.getByRole('row');
    this.navBar = new NavBarComponent(page);
  }

  async searchByName(name: string): Promise<void> {
    await this.employeeNameInput.fill(name);
    await this.searchButton.click();
    // Wait for search results to load after clicking
    await this.page.waitForLoadState('networkidle');
  }

  async expectResultsVisible(): Promise<void> {
    await expect(this.tableRows.first()).toBeVisible();
  }

  async expectNoRecordsFound(): Promise<void> {
    await expect(this.noRecordsText).toBeVisible();
  }
}