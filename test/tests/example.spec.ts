import { test, expect } from '@playwright/test';

test('has beep', async ({ page }) => {
  await page.goto('/');

  page.getByText("Ride Beep App")
});
