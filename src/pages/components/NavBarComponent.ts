import { Page, Locator } from '@playwright/test';

/**
 * NavBarComponent represents the left sidebar navigation
 * that appears on every page after login.
 * It is NOT a page itself - it's a reusable UI piece
 * used BY page objects.
 */
export class NavBarComponent {
  private readonly pimLink: Locator;
  private readonly adminLink: Locator;
  private readonly leaveLink: Locator;
  private readonly dashboardLink: Locator;

  constructor(page: Page) {
    this.pimLink = page.getByRole('link', { name: 'PIM' });
    this.adminLink = page.getByRole('link', { name: 'Admin' });
    this.leaveLink = page.getByRole('link', { name: 'Leave' });
    this.dashboardLink = page.getByRole('link', { name: 'Dashboard' });
  }

  async goToPIM(): Promise<void> {
    await this.pimLink.click();
  }

  async goToAdmin(): Promise<void> {
    await this.adminLink.click();
  }

  async goToLeave(): Promise<void> {
    await this.leaveLink.click();
  }

  async goToDashboard(): Promise<void> {
    await this.dashboardLink.click();
  }
}