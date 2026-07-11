/**
 * FlakinessTracker records which tests needed retries.
 * This data surfaces in the Allure report and console output.
 *
 * In a real project this would write to a database or
 * monitoring system to track trends over time.
 */

interface FlakiRecord {
  testName: string;
  retryCount: number;
  timestamp: string;
  reason: string;
}

class FlakinessTracker {
  private records: FlakiRecord[] = [];

  record(testName: string, retryCount: number, reason: string): void {
    this.records.push({
      testName,
      retryCount,
      timestamp: new Date().toISOString(),
      reason,
    });

    console.warn(
      `[Flakiness] Test "${testName}" needed ${retryCount} retry/retries. Reason: ${reason}`
    );
  }

  getSummary(): FlakiRecord[] {
    return this.records;
  }

  printSummary(): void {
    if (this.records.length === 0) {
      console.log('[Flakiness] No flaky tests detected in this run ✓');
      return;
    }

    console.warn('\n[Flakiness] ⚠️  FLAKY TESTS DETECTED:');
    this.records.forEach(r => {
      console.warn(
        `  - "${r.testName}" retried ${r.retryCount} time(s) at ${r.timestamp}`
      );
      console.warn(`    Reason: ${r.reason}`);
    });
    console.warn(
      '\nThese tests should be investigated and fixed, not just retried.\n'
    );
  }
}

// Singleton - one tracker for the whole test run
export const flakinessTracker = new FlakinessTracker();