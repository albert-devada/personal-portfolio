# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: home.spec.ts >> Homepage E2E Test >> should load the homepage and display basic portfolio elements
- Location: e2e/home.spec.ts:4:9

# Error details

```
Error: browserType.launch: Failed to launch: Error: spawn /root/.cache/ms-playwright/firefox-1538/firefox/firefox ENOENT
Call log:
  - <launching> /root/.cache/ms-playwright/firefox-1538/firefox/firefox -no-remote -headless -profile /tmp/playwright_firefoxdev_profile-loiONN -juggler-pipe -silent
  - [pid=N/A] starting temporary directories cleanup
  - [pid=N/A] finished temporary directories cleanup

```