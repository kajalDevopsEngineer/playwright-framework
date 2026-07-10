# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: e2e\login.spec.ts >> user can login with valid credentials
- Location: tests\e2e\login.spec.ts:5:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: locator.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for getByPlaceholder('Username')
    - waiting for" https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode" navigation to finish...
    - navigated to "https://opensource-demo.orangehrmlive.com/web/index.php/auth/requestPasswordResetCode"

```

# Page snapshot

```yaml
- generic [ref=e4]:
  - generic [ref=e6]:
    - img "company-branding" [ref=e8]
    - generic [ref=e9]:
      - heading "登录" [level=5] [ref=e10]
      - generic [ref=e11]:
        - generic [ref=e13]:
          - paragraph [ref=e14]: "Username : Admin"
          - paragraph [ref=e15]: "Password : admin123"
        - generic [ref=e16]:
          - generic [ref=e18]:
            - generic [ref=e19]:
              - generic [ref=e20]: 
              - generic [ref=e21]: 用户名
            - textbox "用户名" [active] [ref=e23]
          - generic [ref=e25]:
            - generic [ref=e26]:
              - generic [ref=e27]: 
              - generic [ref=e28]: 密码
            - textbox "密码" [ref=e30]
          - button "登录" [ref=e32] [cursor=pointer]
          - paragraph [ref=e34] [cursor=pointer]: 忘了密码?
      - generic [ref=e35]:
        - generic [ref=e36]:
          - link [ref=e37] [cursor=pointer]:
            - /url: https://www.linkedin.com/company/orangehrm/mycompany/
          - link [ref=e40] [cursor=pointer]:
            - /url: https://www.facebook.com/OrangeHRM/
          - link [ref=e43] [cursor=pointer]:
            - /url: https://twitter.com/orangehrm?lang=en
          - link [ref=e46] [cursor=pointer]:
            - /url: https://www.youtube.com/c/OrangeHRMInc
        - generic [ref=e49]:
          - paragraph [ref=e50]: OrangeHRM OS 5.9
          - paragraph [ref=e51]:
            - text: © 2005 - 2026
            - link "OrangeHRM, Inc" [ref=e52] [cursor=pointer]:
              - /url: http://www.orangehrm.com
            - text: . All rights reserved.
  - img "orangehrm-logo" [ref=e54]
```

# Test source

```ts
  1  | import { Page, Locator, expect } from '@playwright/test';
  2  | import { BasePage } from './BasePage';
  3  | 
  4  | export class LoginPage extends BasePage {
  5  |   private readonly usernameInput: Locator;
  6  |   private readonly passwordInput: Locator;
  7  |   private readonly loginButton: Locator;
  8  | 
  9  |   constructor(page: Page) {
  10 |     super(page);
  11 |     this.usernameInput = page.getByPlaceholder('Username');
  12 |     this.passwordInput = page.getByPlaceholder('Password');
  13 |     this.loginButton = page.getByRole('button', { name: 'Login' });
  14 |   }
  15 | 
  16 |   async open(): Promise<void> {
  17 |     await this.goto('/web/index.php/auth/login');
  18 |   }
  19 | 
  20 |   async login(username: string, password: string): Promise<void> {
> 21 |     await this.usernameInput.fill(username);
     |                              ^ Error: locator.fill: Test timeout of 30000ms exceeded.
  22 |     await this.passwordInput.fill(password);
  23 |     await this.loginButton.click();
  24 | 
  25 |     // Wait for the redirect chain to complete
  26 |     // OrangeHRM goes: /auth/validate → /dashboard/index
  27 |     // CI machines need explicit wait here as redirect is slower
  28 |     await this.page.waitForURL('**/dashboard/**', { timeout: 30000 });
  29 |   }
  30 | 
  31 |   async expectLoginPageVisible(): Promise<void> {
  32 |     await expect(this.loginButton).toBeVisible();
  33 |   }
  34 | }
```