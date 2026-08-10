# 🧪 Testing Documentation

This directory contains the testing documentation and setup for the **`portofolio-v1`** project.

## 📋 Overview

The project uses a comprehensive testing strategy combining:
- **Jest**: JavaScript & TypeScript Unit testing framework.
- **React Testing Library**: React component testing with DOM assertions.
- **Playwright**: Cross-browser End-to-End (E2E) testing.

---

## 🏃 Running Tests

### 1. Unit & Component Tests (Jest + React Testing Library)
Run all Jest test suites:
```bash
npm test
```

Run Jest in watch mode during development:
```bash
npm run test:watch
```

### 2. End-to-End Tests (Playwright)
Run Playwright tests across Chromium, Firefox, and WebKit:
```bash
npm run test:e2e
```

---

## 📁 Directory Structure

```text
portofolio-v1/
├── src/
│   ├── lib/__tests__/              # Utility & Helper Unit Tests
│   ├── components/__tests__/       # UI Component Tests
│   └── tools/__tests__/            # Cybersecurity & Dev Tools Tests
├── e2e/                            # Playwright End-to-End Tests
├── jest.config.ts                  # Jest configuration
├── jest.setup.ts                   # DOM matchers & browser mocks
└── playwright.config.ts            # Playwright configuration
```

---

## ⚙️ CI/CD Integration

All tests are automatically executed on every `push` and `pull_request` via GitHub Actions (`.github/workflows/playwright.yml`).
