import { test } from '@playwright/test';

test('the sign in page renders', async ({ page }) => {
  await page.goto('/', { timeout: 80000 });

  await page.getByText("Ride Beep App")
});
