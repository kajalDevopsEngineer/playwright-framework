/**
 * Environment configuration management.
 *
 * Supports multiple environments — dev, staging, prod.
 * The active environment is controlled by the ENV
 * environment variable, defaulting to 'demo'.
 *
 * Usage:
 *   ENV=staging npx playwright test
 *   ENV=prod npx playwright test --grep "@smoke"
 */

export interface EnvironmentConfig {
  name: string;
  baseURL: string;
  apiBaseURL: string;
  credentials: {
    username: string;
    password: string;
  };
  timeouts: {
    action: number;
    navigation: number;
    test: number;
  };
}

const environments: Record<string, EnvironmentConfig> = {
  // Public demo - used for development and portfolio
  demo: {
    name: 'OrangeHRM Demo',
    baseURL: 'https://opensource-demo.orangehrmlive.com',
    apiBaseURL: 'https://opensource-demo.orangehrmlive.com',
    credentials: {
      username: 'Admin',
      password: 'admin123',
    },
    timeouts: {
      action: 30000,
      navigation: 30000,
      test: 60000,
    },
  },

  // Staging environment (example - would be real URL in a real project)
  staging: {
    name: 'Staging',
    baseURL: process.env.STAGING_URL ||
      'https://staging.orangehrm.example.com',
    apiBaseURL: process.env.STAGING_API_URL ||
      'https://staging.orangehrm.example.com',
    credentials: {
      username: process.env.STAGING_USERNAME || 'testuser',
      password: process.env.STAGING_PASSWORD || 'testpass',
    },
    timeouts: {
      action: 15000,    // Staging is faster than demo
      navigation: 15000,
      test: 45000,
    },
  },

  // Production - smoke tests only, read-only operations
  production: {
    name: 'Production',
    baseURL: process.env.PROD_URL ||
      'https://orangehrm.example.com',
    apiBaseURL: process.env.PROD_API_URL ||
      'https://orangehrm.example.com',
    credentials: {
      username: process.env.PROD_USERNAME || '',
      password: process.env.PROD_PASSWORD || '',
    },
    timeouts: {
      action: 20000,
      navigation: 20000,
      test: 60000,
    },
  },
};

/**
 * Get the active environment config.
 * Reads ENV environment variable, defaults to 'demo'.
 */
export function getEnvironmentConfig(): EnvironmentConfig {
  const envName = process.env.ENV || 'demo';

  const config = environments[envName];
  if (!config) {
    throw new Error(
      `Unknown environment: "${envName}". ` +
      `Available: ${Object.keys(environments).join(', ')}`
    );
  }

  console.log(`Running against: ${config.name} (${config.baseURL})`);
  return config;
}

// Export the active config as a singleton
export const env = getEnvironmentConfig();