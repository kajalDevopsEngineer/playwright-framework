import { flakinessTracker } from './flakinessTracker';

/**
 * Global teardown runs once after ALL tests complete.
 * Perfect place to print the flakiness summary.
 */
export default async function globalTeardown(): Promise<void> {
  console.log('\n========================================');
  console.log('TEST RUN COMPLETE — FLAKINESS SUMMARY');
  console.log('========================================');
  flakinessTracker.printSummary();
}