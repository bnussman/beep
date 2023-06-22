import { test, expect } from '@playwright/test';

test('has beep', async ({ page }) => {
  await page.goto('/', { timeout: 80000 });

  await page.getByText("Ride Beep App")
});
