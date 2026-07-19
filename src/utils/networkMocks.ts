import { Page } from '@playwright/test';

/**
 * NetworkMocks provides reusable route interceptions
 * for testing different application states without
 * depending on the server returning specific responses.
 *
 * This is especially valuable for:
 * - Error states (500, 404, 401)
 * - Empty states (no data returned)
 * - Slow responses (testing loading indicators)
 * - Offline scenarios
 */
export class NetworkMocks {
  private readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  /**
   * Mock any API endpoint to return a 500 server error.
   * Use this to test how the UI handles server failures.
   */
  async mockServerError(urlPattern: string): Promise<void> {
    await this.page.route(urlPattern, route => {
      route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            status: 500,
            message: 'Internal Server Error',
          },
        }),
      });
    });

    console.log(`[Mock] Server error (500) configured for: ${urlPattern}`);
  }

  /**
   * Mock an endpoint to return empty data.
   * Tests "no results" states without needing empty database.
   */
  async mockEmptyResponse(urlPattern: string): Promise<void> {
    await this.page.route(urlPattern, route => {
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          data: [],
          meta: { total: 0 },
        }),
      });
    });

    console.log(`[Mock] Empty response configured for: ${urlPattern}`);
  }

  /**
   * Mock an endpoint to simulate a slow response.
   * Tests loading states and timeout handling.
   */
  async mockSlowResponse(
  urlPattern: string,
  delayMs: number
): Promise<void> {
  await this.page.route(urlPattern, async route => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    // Check if route is still active before continuing
    try {
      await route.continue();
    } catch (e) {
      // Route already handled - this is fine
      console.log('[Mock] Route already handled, skipping continue');
    }
  });

  console.log(
    `[Mock] Slow response (${delayMs}ms delay) configured for: ${urlPattern}`
  );
}

  /**
   * Mock an endpoint to return a 401 unauthorized response.
   * Tests session expiry and auth error handling.
   */
  async mockUnauthorized(urlPattern: string): Promise<void> {
    await this.page.route(urlPattern, route => {
      route.fulfill({
        status: 401,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            status: 401,
            message: 'Session expired',
          },
        }),
      });
    });

    console.log(`[Mock] Unauthorized (401) configured for: ${urlPattern}`);
  }

  /**
   * Mock an endpoint with custom response data.
   * Full control over what the API returns.
   */
  async mockCustomResponse(
    urlPattern: string,
    status: number,
    body: object
  ): Promise<void> {
    await this.page.route(urlPattern, route => {
      route.fulfill({
        status,
        contentType: 'application/json',
        body: JSON.stringify(body),
      });
    });

    console.log(
      `[Mock] Custom response (${status}) configured for: ${urlPattern}`
    );
  }

  /**
   * Remove all mocks - restore real network behaviour.
   * Important to call in afterEach to avoid mock bleeding
   * into other tests.
   */
  async clearAllMocks(): Promise<void> {
    await this.page.unrouteAll();
    console.log('[Mock] All network mocks cleared');
  }
}