import { expect, test } from '@playwright/test';
import { signup } from '../utilities/auth';
import { getRandomString } from '../utilities/random';

test('a user can sign up', async ({ page }) => {
  await page.goto('/', { timeout: 200_000 });

  await signup(page);
});

test('client side validation works', async ({ page }) => {
  await page.goto('/', { timeout: 200_000 });

  await page.getByRole('button', { name: 'Sign Up' }).click();

  await page.getByRole('button', { name: 'Sign Up' }).click();

  await expect(page.getByText("First name is required")).toBeVisible();
  await expect(page.getByText("Last name is required")).toBeVisible();
  await expect(page.getByText("Password is required")).toBeVisible();
  await expect(page.getByText("Phone number is required")).toBeVisible();
  await expect(page.getByText("Email is required")).toBeVisible();
});

test('server side validation works', async ({ page }) => {
  await page.goto('/', { timeout: 200_000 });

  const name = getRandomString();

  await page.getByRole('button', { name: 'Sign Up' }).click();

  await page.getByLabel('First Name').click();
  await page.getByLabel('First Name').fill('6326573872465');
  await page.getByLabel('Last Name').click();
  await page.getByLabel('Last Name').fill(name);
  await page.getByLabel('Email', { exact: true }).click();
  await page.getByLabel('Email', { exact: true }).fill(`${name}@test.com`);
  await page.getByLabel('Phone').click();
  await page.getByLabel('Phone').fill('bjhfebhjfe');
  await page.getByLabel('Venmo Username').click();
  await page.getByLabel('Venmo Username').fill('test');
  await page.getByLabel('Username', { exact: true }).click();
  await page.getByLabel('Username', { exact: true }).fill(name);
  await page.getByRole('textbox', { name: 'Password' }).click();
  await page.getByRole('textbox', { name: 'Password' }).fill('test');

  const fileChooserPromise = page.waitForEvent('filechooser');
  await page.getByLabel('profile photo').click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles('../app/assets/icon.png');

  await page.getByRole('button', { name: 'Sign Up' }).click();

  await expect(page.getByText("Must only contain letters")).toBeVisible();
  await expect(page.getByText("You must use a .edu email")).toBeVisible();
  await expect(page.getByText("Invalid phone number")).toBeVisible();
});
