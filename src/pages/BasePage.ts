import { Page } from '@playwright/test';

/**
 * BasePage holds behavior shared by every page in the application.
 * Every specific page (LoginPage, DashboardPage, etc.) extends this class.
 */
export class BasePage {
  protected readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Navigate to a given path, relative to baseURL set in playwright.config.ts
   */
  async goto(path: string): Promise<void> {
    await this.page.goto(path);
  }

  /**
   * Get the current page title (browser tab title)
   */
  async getTitle(): Promise<string> {
    return this.page.title();
  }

  /**
   * Wait for the page to be fully loaded - useful after navigation
   * or actions that trigger a full page transition
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }
}