import { Page } from "@playwright/test";

interface Options {
  origin?: string;
  destination?: string;
  groupSize?: number;
}

export async function startRide(page: Page, options?: Options) {
  const origin = options?.origin ?? "The Cottages";
  const destination = options?.destination ?? "Boone Saloon";
  const groupSize = options?.groupSize ? String(options.groupSize) : "3";

  await page.getByLabel("Group Size").click();
  await page.getByLabel("Group Size").fill(groupSize);

  await page.getByLabel("Pick Up Location").click({ force: true });
  await page.getByPlaceholder("Search...").fill(origin);
  await page.getByText(origin).nth(0).click();

  await page.getByLabel("Destination Location").click({ force: true });
  await page.getByPlaceholder("Search...").fill(destination);
  await page.getByText(destination).nth(0).click();

  await page.getByRole("button", { name: "Find Beep" }).click();
}
