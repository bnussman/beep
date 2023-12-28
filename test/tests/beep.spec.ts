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

  await beeperPage.getByRole('button').nth(1).click();
  await beeperPage.getByText('Cars').click();
  await beeperPage.getByLabel('add a car').click();
  await beeperPage.getByPlaceholder('Make').selectOption('Ford');
  await beeperPage.getByPlaceholder('Model').selectOption('F250');
  await beeperPage.getByPlaceholder('Year').selectOption('2023');
  await beeperPage.getByPlaceholder('Color').selectOption('white');

  const fileChooserPromise = beeperPage.waitForEvent('filechooser');
  await beeperPage.getByText('Attach a Photo').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('../app/assets/icon.png');

  await beeperPage.getByRole('button', { name: 'Add Car' }).click();
  await beeperPage.getByRole('button').first().click();
  await beeperPage.getByText('Beep', { exact: true }).click();
  await beeperPage.getByRole('switch').first().check();

  await riderPage.getByLabel('Group Size').click();
  await riderPage.getByLabel('Group Size').fill('3');
  await riderPage.getByLabel('Pick Up Location').click();
  await riderPage.getByLabel('Pick Up Location').fill('The Cottages');
  await riderPage.getByLabel('Destination Location').click();
  await riderPage.getByLabel('Destination Location').fill('Boone Saloon');
  await riderPage.getByRole('button', { name: 'Find Beep' }).click();

  await riderPage.getByText(beeper.name, { exact: false }).click();

  await expect(riderPage.getByText("Waiting on")).toBeVisible();
  // await expect(riderPage.getByText(`User ${beeper.name}`)).toBeVisible();
  await expect(riderPage.getByText("to accept your request.")).toBeVisible();
  await expect(riderPage.getByText("people are ahead of you in User's queue.")).toBeVisible();

  await expect(beeperPage.getByText(rider.name)).toBeVisible();
  await expect(beeperPage.getByText("3", { exact: true })).toBeVisible();
  await expect(beeperPage.getByText("The Cottages")).toBeVisible();
  await expect(beeperPage.getByText("Boone Saloon")).toBeVisible();

  await beeperPage.getByText("Accept").click();

  await expect(riderPage.getByText("Beeper is getting ready to come get you. They will be on the way soon.")).toBeVisible();
  await expect(riderPage.getByText("Call Beeper")).toBeVisible();
  await expect(riderPage.getByText("Text Beeper")).toBeVisible();
  await expect(riderPage.getByText("Pay with Venmo")).toBeVisible();
  await expect(riderPage.getByText("Share Venmo")).toBeVisible();

  await expect(beeperPage.getByText("Get Directions to Rider")).toBeVisible();
  await expect(beeperPage.getByText("Cancel Beep")).toBeVisible();

  await beeperPage.getByText("I'm on the way").click();

  await expect(riderPage.getByText("Beeper is on their way to get you.")).toBeVisible();
  await expect(riderPage.getByText("ETA", { exact: true })).toBeVisible();

  await beeperPage.getByText("I'm here").click();

  await expect(beeperPage.getByText("Get Directions for Beep")).toBeVisible();
  await expect(beeperPage.getByText("Request Money from Rider with Venmo")).toBeVisible();

  await expect(riderPage.getByText(`Beeper is here to pick you up in a white Ford F250`)).toBeVisible();

  await beeperPage.getByText("I'm now beeping this rider").click();

  await expect(riderPage.getByText("You are currently in the car with your beeper.")).toBeVisible();

  await beeperPage.getByText("Done beeping this rider").click();

  await expect(riderPage.getByLabel('Group Size')).toBeVisible();
  await expect(beeperPage.getByText('Your queue is empty')).toBeVisible();
});
