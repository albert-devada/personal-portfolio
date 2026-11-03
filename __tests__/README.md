# 🧪 Testing Documentation

Comprehensive testing documentation, test suites, and verification results for the **Portfolio** project.

## 📋 Overview

The project employs a robust multi-layered testing strategy combining:
- **Jest & React Testing Library**: Fast, isolated unit and component tests.
- **ESLint**: Static analysis and code quality verification.
- **Playwright**: Cross-browser End-to-End (E2E) testing on Chromium, Firefox, and WebKit.
- **Next.js Turbopack**: Production build compilation and static route verification.

---

## 🏃 Test Commands

### 1. Code Quality & Linting
```bash
npm run lint
```

### 2. Unit & Component Tests (Jest)
Run all Jest test suites:
```bash
npm test
```

Run Jest in watch mode during development:
```bash
npm run test:watch
```

### 3. End-to-End Tests (Playwright)
Run Playwright tests across browsers:
```bash
npm run test:e2e
```

### 4. Production Build Verification
```bash
npm run build
```

---

## ✅ Verified Test Execution & Results

### 1. Unit & Component Test Suites (Jest)

```text
 PASS  src/lib/__tests__/utils.test.ts
 PASS  src/components/__tests__/badge.test.tsx
 PASS  src/components/__tests__/button.test.tsx
 PASS  src/tools/__tests__/playground.test.tsx

Test Suites: 4 passed, 4 total
Tests:       17 passed, 17 total
Snapshots:   0 total
Time:        ~2.2s
Ran all test suites.
```

| Test Suite | File Location | Covered Features | Status |
| :--- | :--- | :--- | :---: |
| **Utilities** | `src/lib/__tests__/utils.test.ts` | `cn` class merger, `formatDate`, Rate limiter | ✅ PASS |
| **Badge UI** | `src/components/__tests__/badge.test.tsx` | Variants, status styles, children rendering | ✅ PASS |
| **Button UI** | `src/components/__tests__/button.test.tsx` | Clicks, disabled state, variants, icons | ✅ PASS |
| **Playground** | `src/tools/__tests__/playground.test.tsx` | Geolocation telemetry, IP data display | ✅ PASS |

### 2. Production Build Output (Turbopack)

```text
▲ Next.js 16.2.9 (Turbopack)
✓ Compiled successfully
✓ Finished TypeScript validation
✓ Generating static pages (5/5)
✓ Finalizing page optimization

Route (app)
┌ ƒ /
├ ○ /_not-found
├ ƒ /[...catchAll]
├ ƒ /api
├ ƒ /api/[...notFound]
├ ƒ /api/cvedata
├ ƒ /api/exchange
├ ƒ /api/health
├ ƒ /api/image
├ ƒ /api/market
├ ƒ /api/search
├ ƒ /api/vulndata
├ ƒ /blog
├ ƒ /blog/[slug]
├ ƒ /certificate
├ ƒ /chat
├ ƒ /playground
├ ƒ /project
├ ○ /robots.txt
└ ƒ /sitemap.xml

ƒ Proxy (Middleware)
○  (Static)   prerendered as static content
ƒ  (Dynamic)  server-rendered on demand
```

---

## 📁 Directory Structure

```text
personal-portfolio/
├── src/
│   ├── lib/__tests__/              # Utility & Helper Unit Tests
│   ├── components/__tests__/       # UI Component Tests
│   └── tools/__tests__/            # Security & Utility Tool Tests
├── e2e/                            # Playwright End-to-End Tests
├── __mocks__/                      # ESM & Third-Party Library Mocks (Lenis, Turnstile)
├── jest.config.ts                  # Jest configuration
├── jest.setup.ts                   # DOM matchers & global browser mocks
└── playwright.config.ts            # Playwright configuration
```

---

## ⚙️ CI/CD Pipeline

All tests (Lint, Unit Tests, E2E Tests, and Production Build) run automatically in CI on every `push` and `pull_request` via GitHub Actions (`.github/workflows/playwright.yml`).
