import { test } from '@playwright/test';
import { signup } from '../utilities/auth';

test('a user can sign up', async ({ page }) => {
  await page.goto('/', { timeout: 200_000 });

  await signup(page);
});
