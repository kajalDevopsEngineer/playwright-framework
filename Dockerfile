# ─────────────────────────────────────────────
# Stage 1: Use official Playwright base image
# This already has all browser dependencies installed
# Much faster than installing them yourself
# ─────────────────────────────────────────────
FROM mcr.microsoft.com/playwright:v1.61.1-noble

# Set working directory inside container
WORKDIR /app

# ─────────────────────────────────────────────
# Step 1: Copy package files first
# Docker caches layers - if package.json hasn't changed,
# it reuses cached node_modules (much faster builds)
# ─────────────────────────────────────────────
COPY package*.json ./

# Install dependencies
# npm ci = clean install, exact versions from package-lock.json
RUN npm ci

# ─────────────────────────────────────────────
# Step 2: Copy the rest of the project
# Done AFTER npm ci so code changes don't
# invalidate the node_modules cache
# ─────────────────────────────────────────────
COPY . .

# ─────────────────────────────────────────────
# Step 3: Set environment variable
# CI=true triggers headless mode, correct timeouts etc
# ─────────────────────────────────────────────
ENV CI=true
ENV BASE_URL=https://opensource-demo.orangehrmlive.com

# Default command - run all E2E tests
# Can be overridden when running the container
CMD ["npx", "playwright", "test", "tests/e2e/"]