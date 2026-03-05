import { Page } from "@playwright/test";

export async function createCar(page: Page) {
  await page.getByRole('tab', { name: 'Profile' }).click();

  await page.getByRole('link', { name: '🚙 Cars' }).click();
  await page.getByLabel("Add a car").click();
  await page.getByPlaceholder("Select a make").click();
  await page.getByText("Ford").click();
  await page.getByPlaceholder("Select a model").click();
  await page.getByText("Aspire").click();
  await page.getByPlaceholder("Select a year").click();
  await page.getByText("2023").click();
  await page.getByPlaceholder("Select a color").click();
  await page.getByText("white").click();

  const fileChooserPromise = page.waitForEvent("filechooser");
  await page.getByText("Attach a Photo").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles("../app/assets/icon.png");

  await page.getByRole("button", { name: "Add Car" }).click();
}
