import { test, expect } from '@playwright/test';
import { signup } from '../utilities/auth';

test('a beep can happen between a rider and driver', async ({ browser }) => {
  const riderContext = await browser.newContext();
  const beeperContext = await browser.newContext();

  const riderPage = await riderContext.newPage();
  const beeperPage = await beeperContext.newPage();

  await riderPage.goto('/', { timeout: 200_000 });
  await beeperPage.goto('/', { timeout: 200_000 });

  const rider = await signup(riderPage);
  const beeper = await signup(beeperPage);

  console.log(rider, beeper)

  await beeperPage.getByRole('button').nth(1).click();
  await beeperPage.getByText('Cars').click();
  await beeperPage.getByRole('button', { name: '' }).click();
  await beeperPage.getByLabel('Make').selectOption('BMW');
  await beeperPage.getByLabel('Model').selectOption('128i');
  await beeperPage.getByLabel('Year').selectOption('2023');
  await beeperPage.getByLabel('Color').selectOption('red');

  const fileChooserPromise = beeperPage.waitForEvent('filechooser');
  await beeperPage.getByText('Attach a Photo').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('../app/assets/icon.png');

  await beeperPage.getByRole('button', { name: 'Add Car' }).click();
  await beeperPage.getByRole('button').first().click();
  await beeperPage.getByText('Beep', { exact: true }).click();
  await beeperPage.getByRole('switch').first().check();
});