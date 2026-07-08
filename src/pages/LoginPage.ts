import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './BasePage';

export class LoginPage extends BasePage {
  private readonly usernameInput: Locator;
  private readonly passwordInput: Locator;
  private readonly loginButton: Locator;

  constructor(page: Page) {
    super(page);
    this.usernameInput = page.getByPlaceholder('Username');
    this.passwordInput = page.getByPlaceholder('Password');
    this.loginButton = page.getByRole('button', { name: 'Login' });
  }

  async open(): Promise<void> {
    await this.goto('/web/index.php/auth/login');
  }

  async login(username: string, password: string): Promise<void> {
    await this.usernameInput.fill(username);
    await this.passwordInput.fill(password);
    await this.loginButton.click();

    // Wait for the redirect chain to complete
    // OrangeHRM goes: /auth/validate → /dashboard/index
    // CI machines need explicit wait here as redirect is slower
    await this.page.waitForURL('**/dashboard/**', { timeout: 30000 });
  }

  async expectLoginPageVisible(): Promise<void> {
    await expect(this.loginButton).toBeVisible();
  }
}