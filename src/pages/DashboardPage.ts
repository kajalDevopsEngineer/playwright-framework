import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';
import { NavBarComponent } from './components/NavBarComponent';

export class DashboardPage extends BasePage {
  private readonly dashboardHeading: Locator;
  readonly navBar: NavBarComponent;

  constructor(page: Page) {
    super(page);
    this.dashboardHeading = page.getByRole('heading', { name: 'Dashboard' });
    this.navBar = new NavBarComponent(page);
  }

  async expectDashboardVisible(): Promise<void> {
    await expect(this.dashboardHeading).toBeVisible();
  }
}