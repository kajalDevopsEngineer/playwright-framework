import http from 'k6/http';
import { check, sleep } from 'k6';
import { Rate, Trend } from 'k6/metrics';

// ─────────────────────────────────────────────
// Custom metrics
// ─────────────────────────────────────────────

// Tracks what percentage of requests failed
const errorRate = new Rate('error_rate');

// Tracks response time for employee list specifically
const employeeListTrend = new Trend('employee_list_duration');

// ─────────────────────────────────────────────
// Test configuration
// ─────────────────────────────────────────────
export const options = {
  stages: [
    { duration: '10s', target: 2 },  // max 2 VUs for demo server
    { duration: '20s', target: 2 },
    { duration: '10s', target: 0 },
  ],
  thresholds: {
    // Relaxed for demo server - real project would be stricter
    http_req_duration: ['p(95)<10000'],
    error_rate: ['rate<0.6'],  // demo server has high error rate
    employee_list_duration: ['p(95)<10000'],
  },
};

// ─────────────────────────────────────────────
// Base URL
// ─────────────────────────────────────────────
const BASE_URL = __ENV.BASE_URL ||
  'https://opensource-demo.orangehrmlive.com';

// ─────────────────────────────────────────────
// Login function - gets session cookie
// ─────────────────────────────────────────────
function login() {
  const loginRes = http.post(
    `${BASE_URL}/web/index.php/auth/validate`,
    {
      _username: 'Admin',
      _password: 'admin123',
    },
    {
      tags: { endpoint: 'login' },
      redirects: 5,
    }
  );

  check(loginRes, {
    'login status is 200 or 302': (r) =>
      r.status === 200 || r.status === 302,
  });

  return loginRes;
}

// ─────────────────────────────────────────────
// Main test function
// Runs once per virtual user per iteration
// ─────────────────────────────────────────────
export default function () {
  // Step 1: Login
  const loginRes = login();
  errorRate.add(
    loginRes.status !== 200 && loginRes.status !== 302
  );

  // Small pause between actions
  // Simulates real user thinking time
  sleep(1);

  // Step 2: Get employee list
  const employeeRes = http.get(
    `${BASE_URL}/web/index.php/api/v2/pim/employees`,
    {
      headers: {
        Accept: 'application/json',
      },
      tags: { endpoint: 'employee_list' },
    }
  );

  // Record custom metric
  employeeListTrend.add(employeeRes.timings.duration);

  // Check response
  const employeeCheckPassed = check(employeeRes, {
    'employee list status is 200': (r) => r.status === 200,
    'employee list returns data': (r) => {
      try {
        const body = JSON.parse(r.body);
        return body.data !== undefined;
      } catch {
        return false;
      }
    },
  });

  errorRate.add(!employeeCheckPassed);

  sleep(1);
}

// ─────────────────────────────────────────────
// Summary output - runs once after all tests
// ─────────────────────────────────────────────
export function handleSummary(data) {
  const passed = Object.values(data.metrics)
    .every(m => !m.thresholds ||
      Object.values(m.thresholds).every(t => !t.ok === false)
    );

  console.log('\n========================================');
  console.log('PERFORMANCE TEST SUMMARY');
  console.log('========================================');
  console.log(`Total requests: ${data.metrics.http_reqs?.values?.count}`);
  console.log(`Failed requests: ${data.metrics.http_req_failed?.values?.passes}`);
  console.log(`Avg response time: ${data.metrics.http_req_duration?.values?.avg?.toFixed(2)}ms`);
  console.log(`p95 response time: ${data.metrics.http_req_duration?.values['p(95)']?.toFixed(2)}ms`);
  console.log(`Error rate: ${(data.metrics.error_rate?.values?.rate * 100)?.toFixed(2)}%`);
  console.log('========================================\n');

  return {};
}