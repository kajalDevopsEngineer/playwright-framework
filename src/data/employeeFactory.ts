/**
 * Factory function for creating employee test data.
 *
 * Why a factory instead of hardcoded values?
 * - Every test gets unique data — no collisions between parallel runs
 * - You only specify what your test cares about, defaults fill the rest
 * - If the data shape changes, you update one factory, not every test
 */

export interface EmployeeData {
  firstName: string;
  lastName: string;
  employeeId: string;
}

/**
 * Generate a unique employee ID based on timestamp
 * Ensures no two test runs create the same employee ID
 */
const generateUniqueId = (): string => {
  return `T${Date.now().toString().slice(-6)}`;
};

/**
 * Create employee test data with sensible defaults.
 * Pass overrides for only what your specific test needs.
 *
 * Usage:
 *   createEmployeeData()
 *   → { firstName: 'Test', lastName: 'User', employeeId: 'T123456' }
 *
 *   createEmployeeData({ firstName: 'John' })
 *   → { firstName: 'John', lastName: 'User', employeeId: 'T123456' }
 */
export const createEmployeeData = (
  overrides: Partial<EmployeeData> = {}
): EmployeeData => ({
  firstName: 'Test',
  lastName: 'AutoUser',
  employeeId: generateUniqueId(),
  ...overrides,
});