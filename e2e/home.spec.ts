import { test, expect } from "@playwright/test";

test.describe("Homepage E2E Test", () => {
    test("should load the homepage and display basic portfolio elements", async ({
        page,
    }) => {
        await page.goto("/");
        await expect(page).toHaveTitle(/Naufal|Burhan|Cybersecurity|Backend/i);
        const body = page.locator("body");
        await expect(body).toBeVisible();
    });
});
