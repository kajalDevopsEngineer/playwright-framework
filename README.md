# Playwright Automation Framework

![Playwright Tests](https://github.com/kajalDevopsEngineer/playwright-framework/actions/workflows/playwright.yml/badge.svg)

An enterprise-grade test automation framework built with **Playwright** and **TypeScript**, demonstrating senior-level SDET skills including framework architecture, API-driven test setup/teardown, CI/CD pipeline ownership, and automated reporting.

---

## 🔗 Live Test Report

👉 **[View Latest Allure Report](https://kajaldevopsengineer.github.io/playwright-framework/)**

Automatically updated after every push to main.

---

## 🏗️ Architecture

```
playwright-framework/
├── src/
│   ├── pages/                  # Page Object Model
│   │   ├── BasePage.ts         # Shared base class for all pages
│   │   ├── LoginPage.ts        # Login page actions and locators
│   │   ├── DashboardPage.ts    # Dashboard assertions and navigation
│   │   ├── EmployeeListPage.ts # Employee search and results
│   │   └── components/
│   │       └── NavBarComponent.ts  # Shared navigation component
│   ├── api/
│   │   └── APIClient.ts        # Typed API client for setup/teardown
│   └── data/
│       └── employeeFactory.ts  # Test data factory with defaults
├── tests/
│   ├── e2e/                    # End-to-end UI tests
│   │   ├── login.spec.ts
│   │   ├── employeeSearch.spec.ts
│   │   └── employeeWithApiSetup.spec.ts
│   └── api/                    # API-only tests
│       └── employee.api.spec.ts
├── .github/
│   └── workflows/
│       └── playwright.yml      # GitHub Actions CI/CD pipeline
└── playwright.config.ts        # Framework configuration
```

---

## ⚡ Key Features

- **Page Object Model** — Clean separation between test logic and page interactions. All locators are private, exposed only through meaningful action methods.
- **API Setup & Teardown** — Test data created and cleaned up via API before/after each test — no manual data preparation, fully isolated runs.
- **Custom Fixtures** — Reusable authenticated sessions and data setup across the test suite.
- **Test Data Factory** — `createEmployeeData()` generates unique test data per run using TypeScript's `Partial<T>` — no hardcoded values.
- **CI/CD Pipeline** — GitHub Actions triggers on every PR and push to main. Tests run headless on Ubuntu with automatic retry on failure.
- **Allure Reporting** — Step-by-step test breakdown with screenshots on failure, auto-published to GitHub Pages after every run.
- **TypeScript** — Strict mode enabled. Typed API responses, typed page objects, typed fixtures — errors caught at compile time, not runtime.

---

## 🛠️ Tech Stack

| Tool | Purpose |
|---|---|
| Playwright | Browser automation and API testing |
| TypeScript | Type-safe test code |
| GitHub Actions | CI/CD pipeline |
| Allure | Test reporting |
| OrangeHRM | Application under test |
| Node.js | Runtime |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- npm

### Installation

```bash
git clone https://github.com/kajalDevopsEngineer/playwright-framework.git
cd playwright-framework
npm ci
npx playwright install chromium
```

### Run all E2E tests

```bash
npx playwright test tests/e2e/
```

### Run a specific test file

```bash
npx playwright test tests/e2e/login.spec.ts
```

### Run tests headed (watch browser)

```bash
npx playwright test tests/e2e/ --headed
```

### Generate and view Allure report locally

```bash
npx allure generate allure-results --clean -o allure-report
npx allure open allure-report
```

---

## 🧪 Test Coverage

| Area | Tests | Type |
|---|---|---|
| Authentication | Login with valid credentials | E2E |
| Employee Search | Search by name, no records found | E2E |
| Employee Management | Create via API, verify in UI, delete | E2E + API |
| Employee API | GET employees, validate response schema | API |

---

## 🔄 CI/CD Pipeline

Every push to `main` and every pull request triggers the pipeline automatically:

```
Push / PR
    ↓
Install dependencies + Playwright browsers
    ↓
Run E2E tests (headless, 1 worker)
    ↓
Generate Allure Report
    ↓
Deploy to GitHub Pages
```

Pipeline status badge at the top of this README reflects the latest run.

---

## 💡 Framework Decisions

**Why Playwright over Selenium?**
Playwright's auto-wait eliminates the need for manual waits and sleep() calls. Built-in request context enables API testing without additional libraries. Superior debugging with trace viewer and screenshot-on-failure.

**Why API setup/teardown instead of UI?**
Creating test data via API takes under 1 second vs 10–15 seconds through the UI. Tests are faster, more reliable, and fully isolated — no dependency on pre-existing data.

**Why TypeScript strict mode?**
If an API response shape changes, the framework fails at compile time, not at runtime during a test run at 2am in CI. Types also make page objects self-documenting for teammates.

**Why Allure over Playwright's built-in reporter?**
Allure provides step-by-step test breakdown, categorised views, and a professional UI suitable for sharing with non-technical stakeholders. Published automatically to GitHub Pages — no CI access needed to view results.

---

## ☸️ Kubernetes Deployment

The framework includes Kubernetes manifests for running tests at scale in a K8s cluster.

### Running tests as a K8s Job

```bash
# Create secrets first (ask DevOps for values)
kubectl apply -f k8s/secrets.example.yaml

# Run smoke tests as a K8s Job
kubectl apply -f k8s/test-job.yaml

# Monitor the job
kubectl get jobs
kubectl logs job/playwright-tests

# Run tests in parallel across 4 pods
kubectl apply -f k8s/parallel-test-job.yaml
```

### Why Kubernetes for test execution?

- **Scale** — run 50 pods in parallel, reduce suite time from hours to minutes
- **Isolation** — each pod is a clean environment, no shared state
- **Resource management** — CPU and memory limits prevent one job starving others
- **Secrets management** — credentials injected from K8s Secrets, never in code

## 👩‍💻 Author

**Kajal Potghan** — Senior SDET  
[LinkedIn](https://www.linkedin.com/in/kajal-potghan-654b5617b) | [GitHub](https://github.com/kajalDevopsEngineer)