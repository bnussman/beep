import { test, expect } from '@playwright/test';

test('a beep can happen between a rider and driver', async ({ browser }) => {
  const riderContext = await browser.newContext();
  const beeperContext = await browser.newContext();

  const riderPage = await riderContext.newPage();
  const beeperPage = await beeperContext.newPage();

  await riderPage.goto('/', { timeout: 200_000 });
  await beeperPage.goto('/', { timeout: 200_000 });
});
