import { test } from '@playwright/test';

test('the sign in page renders', async ({ page }) => {
  await page.goto('/', { timeout: 200_000, waitUntil: 'domcontentloaded' });

  await page.getByText("Ride Beep App")
});
