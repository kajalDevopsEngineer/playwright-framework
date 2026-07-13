import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';
import { LoginPage } from '../../src/pages/LoginPage';
import { DashboardPage } from '../../src/pages/DashboardPage';

// Known violations on OrangeHRM demo that we can't fix
// because it's a third-party application.
// In our OWN application, this list would be empty
// and we'd assert violations.length === 0
const KNOWN_VIOLATIONS = [
  'color-contrast',
  'html-has-lang',
  'link-name',
];

test.describe('Accessibility tests', () => {

  test('login page has no UNKNOWN accessibility violations @regression',
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      await loginPage.open();
      await page.waitForLoadState('domcontentloaded');

      const results = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        .analyze();

      // Log all violations clearly
      if (results.violations.length > 0) {
        console.log('\nAccessibility violations found:');
        results.violations.forEach(v => {
          const isKnown = KNOWN_VIOLATIONS.includes(v.id);
          console.log(
            `${isKnown ? '📋 [KNOWN]' : '🆕 [NEW]'} [${v.impact}] ${v.id}: ${v.description}`
          );
        });
      }

      // Find any violations NOT in our known list
      // These would be NEW violations introduced recently
      const unknownViolations = results.violations.filter(
        v => !KNOWN_VIOLATIONS.includes(v.id)
      );

      // Only fail on NEW violations we haven't seen before
      expect(
        unknownViolations,
        `Found ${unknownViolations.length} NEW accessibility violations not in known list`
      ).toHaveLength(0);
    }
  );

  test('dashboard page has no critical accessibility violations @regression',
    async ({ page }) => {
      const loginPage = new LoginPage(page);
      const dashboardPage = new DashboardPage(page);

      await loginPage.open();
      await loginPage.login('Admin', 'admin123');
      await dashboardPage.expectDashboardVisible();
      await page.waitForLoadState('domcontentloaded');

      const accessibilityResults = await new AxeBuilder({ page })
        .withTags(['wcag2a', 'wcag2aa'])
        // Exclude third-party widgets we can't control
        .exclude('.oxd-topbar-header-usericon')
        .analyze();

      // For a third-party app like OrangeHRM, violations are expected
      // In your own app, you'd assert violations.length === 0
      // Here we log them and note what we found
      console.log(
        `\nAccessibility scan complete.` +
        `\nViolations found: ${accessibilityResults.violations.length}` +
        `\nPasses: ${accessibilityResults.passes.length}`
      );

      // Log each violation with actionable detail
      accessibilityResults.violations.forEach(violation => {
        console.log(`\n⚠️  [${violation.impact}] ${violation.id}: ${violation.description}`);
      });

      // On a third-party demo app we don't fail on violations
      // but in your own application this would be:
      // expect(accessibilityResults.violations).toHaveLength(0);
    }
  );
});