/**
 * Retry utility for handling flaky operations.
 *
 * Important distinction:
 * - Playwright's built-in retry (in config) retries the WHOLE test
 * - This utility retries a SPECIFIC operation within a test
 *
 * Use this for operations that are inherently unstable
 * (like third-party API calls, file system operations)
 * NOT as a substitute for fixing the root cause.
 */

export interface RetryOptions {
  attempts: number;
  delayMs: number;
  description: string;
}

/**
 * Retry an async operation with configurable attempts and delay.
 * Logs each attempt for debugging.
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions
): Promise<T> {
  const { attempts, delayMs, description } = options;
  let lastError: Error = new Error('Unknown error');

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      console.log(`[Retry] ${description} - attempt ${attempt}/${attempts}`);
      const result = await operation();
      if (attempt > 1) {
        console.log(`[Retry] ${description} - succeeded on attempt ${attempt}`);
      }
      return result;
    } catch (error) {
      lastError = error as Error;
      console.warn(
        `[Retry] ${description} - attempt ${attempt} failed: ${lastError.message}`
      );
      if (attempt < attempts) {
        console.log(`[Retry] Waiting ${delayMs}ms before next attempt...`);
        await new Promise(resolve => setTimeout(resolve, delayMs));
      }
    }
  }

  throw new Error(
    `[Retry] ${description} failed after ${attempts} attempts. Last error: ${lastError.message}`
  );
}