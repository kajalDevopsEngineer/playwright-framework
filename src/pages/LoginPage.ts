import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  // Locators are defined once, as class properties
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page); // calls BasePage's constructor, sets this.page

    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  /**
   * Navigate directly to the login page
   */
  async open(): Promise<void> {
    await this.goto('/web/index.php/auth/login');
  }

  /**
   * Perform a full login action - fill credentials and submit
   */
  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();
  }

  /**
   * Assert the login page is currently displayed
   */
  async expectLoginPageVisible(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
  }
}