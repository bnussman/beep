import { expect, test } from '@playwright/test';

test('the app works', async ({ page }) => {
  await page.goto('/', { timeout: 200_000 });

  await expect(page.getByText("Ride Beep App")).toBeVisible();
});
