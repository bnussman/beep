import { test, expect } from "@playwright/test";
import { signup } from "../utilities/auth";

test("a beep can happen between a rider and driver", async ({ browser }) => {
  const riderContext = await browser.newContext();
  const beeperContext = await browser.newContext();

  const riderPage = await riderContext.newPage();
  const beeperPage = await beeperContext.newPage();

  await riderPage.goto("/", { timeout: 200_000 });
  await beeperPage.goto("/", { timeout: 200_000 });

  const rider = await signup(riderPage);
  const beeper = await signup(beeperPage);

  await beeperPage.getByRole("button").nth(0).click();
  await beeperPage.getByText("Cars").click();
  await beeperPage.getByLabel("Add a car").click();
  await beeperPage.getByText("Make").click();
  await beeperPage.getByText("Ford").click();
  await beeperPage.getByText("Model").click();
  await beeperPage.getByText("Aspire").click();
  await beeperPage.getByText("Year").click();
  await beeperPage.getByText("2023").click();
  await beeperPage.getByText("Color").click();
  await beeperPage.getByText("white").click();

  const fileChooserPromise = beeperPage.waitForEvent("filechooser");
  await beeperPage.getByText("Attach a Photo").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles("../app/assets/icon.png");

  await beeperPage.getByRole("button", { name: "Add Car" }).click();
  await expect(beeperPage.getByText("Add Car")).not.toBeVisible();
  await beeperPage.getByRole("button").first().click(); // click drawer button
  await beeperPage.getByText("Beep", { exact: true }).click();
  await beeperPage.getByRole("switch").first().click();

  await riderPage.getByLabel("Group Size").click();
  await riderPage.getByLabel("Group Size").fill("3");
  await riderPage.getByLabel("Pick Up Location").click();
  await riderPage.getByLabel("Pick Up Location").fill("The Cottages");
  await riderPage.getByLabel("Destination Location").click();
  await riderPage.getByLabel("Destination Location").fill("Boone Saloon");
  await riderPage.getByRole("button", { name: "Find Beep" }).click();

  await riderPage.getByText(beeper.name, { exact: false }).click();

  await expect(riderPage.getByText("Waiting on")).toBeVisible();
  // await expect(riderPage.getByText(`User ${beeper.name}`)).toBeVisible();
  await expect(riderPage.getByText("to accept your request.")).toBeVisible();
  await expect(
    riderPage.getByText("people are ahead of you in User's queue."),
  ).toBeVisible();

  await expect(beeperPage.getByText(rider.name)).toBeVisible();
  await expect(beeperPage.getByText("3", { exact: true })).toBeVisible();
  await expect(beeperPage.getByText("The Cottages")).toBeVisible();
  await expect(beeperPage.getByText("Boone Saloon")).toBeVisible();

  await beeperPage.getByRole("button", { name: "Accept" }).click();

  await expect(
    riderPage.getByText(
      "Beeper is getting ready to come get you. They will be on the way soon.",
    ),
  ).toBeVisible();

  await riderPage.getByText("...").click();
  await riderPage.getByText("Contact").click();

  await expect(riderPage.getByText("Call")).toBeVisible();
  await expect(riderPage.getByText("Text")).toBeVisible();

  await riderPage.getByText("Pay").click();
  await expect(riderPage.getByText("Venmo")).toBeVisible();
  // await expect(riderPage.getByText("Share Venmo")).toBeVisible(); removed for now

  await beeperPage.getByText("...").click();
  await expect(beeperPage.getByText("Directions to Rider")).toBeVisible();
  await expect(beeperPage.getByText("Cancel Beep")).toBeVisible();
  await beeperPage.getByText("...").click();

  await beeperPage.getByText("I'm on the way").click();

  await expect(
    riderPage.getByText("Beeper is on their way to get you."),
  ).toBeVisible();
  await expect(riderPage.getByText("ETA", { exact: true })).toBeVisible();

  await beeperPage.getByText("I'm here").click();

  await beeperPage.getByText("...").click();
  await expect(beeperPage.getByText("Directions for Beep")).toBeVisible();
  await expect(beeperPage.getByText("Request Money with Venmo")).toBeVisible();
  await beeperPage.getByText("...").click();

  await expect(
    riderPage.getByText(`Beeper is here to pick you up in a white Ford Aspire`),
  ).toBeVisible();

  await beeperPage.getByText("I'm now beeping this rider").click();

  await expect(
    riderPage.getByText("You are currently in the car with your beeper."),
  ).toBeVisible();

  await beeperPage.getByText("Done beeping this rider").click();

  await expect(riderPage.getByLabel("Group Size")).toBeVisible();
  await expect(beeperPage.getByText("Your queue is empty")).toBeVisible();
});

test("a beeper can beep multiple riders", async ({ browser }) => {
  const beeperContext = await browser.newContext();
  const rider1Context = await browser.newContext();
  const rider2Context = await browser.newContext();
  const rider3Context = await browser.newContext();

  const beeperPage = await beeperContext.newPage();
  const rider1Page = await rider1Context.newPage();
  const rider2Page = await rider2Context.newPage();
  const rider3Page = await rider3Context.newPage();

  await beeperPage.goto("/", { timeout: 200_000 });
  await rider1Page.goto("/", { timeout: 200_000 });
  await rider2Page.goto("/", { timeout: 200_000 });
  await rider3Page.goto("/", { timeout: 200_000 });

  const beeper = await signup(beeperPage);
  const rider1 = await signup(rider1Page);
  const rider2 = await signup(rider2Page);
  const rider3 = await signup(rider3Page);

  await beeperPage.getByRole("button").nth(0).click();
  await beeperPage.getByText("Cars").click();
  await beeperPage.getByLabel("Add a car").click();
  await beeperPage.getByText("Make").click();
  await beeperPage.getByText("Ford").click();
  await beeperPage.getByText("Model").click();
  await beeperPage.getByText("Aspire").click();
  await beeperPage.getByText("Year").click();
  await beeperPage.getByText("2021").click();
  await beeperPage.getByText("Color").click();
  await beeperPage.getByText("gray").click();

  const fileChooserPromise = beeperPage.waitForEvent("filechooser");
  await beeperPage.getByText("Attach a Photo").click();
  const fileChooser = await fileChooserPromise;
  await fileChooser.setFiles("../app/assets/icon.png");

  await beeperPage.getByRole("button", { name: "Add Car" }).click();
  await beeperPage.getByLabel("Show navigation menu").nth(1).click(); // click drawer button
  await beeperPage.getByText("Beep", { exact: true }).click();
  await beeperPage.getByRole("switch").first().click();

  // As rider 1, get a beep.
  await rider1Page.getByLabel("Group Size").click();
  await rider1Page.getByLabel("Group Size").fill("3");
  await rider1Page.getByLabel("Pick Up Location").click();
  await rider1Page.getByLabel("Pick Up Location").fill("The Cottages");
  await rider1Page.getByLabel("Destination Location").click();
  await rider1Page.getByLabel("Destination Location").fill("Boone Saloon");
  await rider1Page.getByRole("button", { name: "Find Beep" }).click();

  await rider1Page.getByText(beeper.name, { exact: false }).click();

  await expect(rider1Page.getByText("Waiting on")).toBeVisible();
  await expect(rider1Page.getByText(beeper.name)).toBeVisible();
  await expect(rider1Page.getByText("to accept your request.")).toBeVisible();
  await expect(rider1Page.getByText("0")).toBeVisible();
  await expect(
    rider1Page.getByText("people are ahead of you in User's queue."),
  ).toBeVisible();

  // As the beeper, verify rider 1 shows up
  await expect(beeperPage.getByText(rider1.name)).toBeVisible();
  await expect(beeperPage.getByText("3", { exact: true })).toBeVisible();
  await expect(beeperPage.getByText("The Cottages")).toBeVisible();
  await expect(beeperPage.getByText("Boone Saloon")).toBeVisible();

  // As rider 2, get a beep.
  await rider2Page.getByLabel("Group Size").click();
  await rider2Page.getByLabel("Group Size").fill("1");
  await rider2Page.getByLabel("Pick Up Location").click();
  await rider2Page.getByLabel("Pick Up Location").fill("Mountaineer Village");
  await rider2Page.getByLabel("Destination Location").click();
  await rider2Page.getByLabel("Destination Location").fill("Macado's");
  await rider2Page.getByRole("button", { name: "Find Beep" }).click();

  await rider2Page.getByText(beeper.name, { exact: false }).click();

  await expect(rider2Page.getByText("Waiting on")).toBeVisible();
  await expect(rider2Page.getByText(beeper.name)).toBeVisible();
  await expect(rider2Page.getByText("to accept your request.")).toBeVisible();

  // As the beeper, verify rider 2 shows up
  await expect(beeperPage.getByText(rider2.name)).toBeVisible();
  await expect(beeperPage.getByText("1", { exact: true })).toBeVisible();
  await expect(beeperPage.getByText("Mountaineer Village")).toBeVisible();
  await expect(beeperPage.getByText("Macado's")).toBeVisible();

  // As rider 3, get a beep.
  await rider3Page.getByLabel("Group Size").click();
  await rider3Page.getByLabel("Group Size").fill("4");
  await rider3Page.getByLabel("Pick Up Location").click();
  await rider3Page.getByLabel("Pick Up Location").fill("East Village");
  await rider3Page.getByLabel("Destination Location").click();
  await rider3Page.getByLabel("Destination Location").fill("Black Cat");
  await rider3Page.getByRole("button", { name: "Find Beep" }).click();

  await rider3Page.getByText(beeper.name, { exact: false }).click();

  await expect(rider3Page.getByText("Waiting on")).toBeVisible();
  await expect(rider3Page.getByText(beeper.name)).toBeVisible();
  await expect(rider3Page.getByText("to accept your request.")).toBeVisible();

  // As the beeper, verify rider 3 shows up
  await expect(beeperPage.getByText(rider3.name)).toBeVisible();
  await expect(beeperPage.getByText("4", { exact: true })).toBeVisible();
  await expect(beeperPage.getByText("East Village")).toBeVisible();
  await expect(beeperPage.getByText("Black Cat")).toBeVisible(); // Yum Yum😋🥺

  // At this point, the beeper has 3 riders in their queue

  // Accept the first rider
  await beeperPage.getByRole("button", { name: "Accept" }).first().click();

  await expect(
    rider1Page.getByText(
      "Beeper is getting ready to come get you. They will be on the way soon.",
    ),
  ).toBeVisible();

  await expect(rider2Page.getByText("1").first()).toBeVisible();
  await expect(
    rider2Page.getByText("person is ahead of you in User's queue."),
  ).toBeVisible();

  await expect(rider3Page.getByText("1").first()).toBeVisible();
  await expect(
    rider3Page.getByText("person is ahead of you in User's queue."),
  ).toBeVisible();

  // Accept the second rider
  await beeperPage.getByText("Queue", { exact: true }).click();
  await beeperPage.getByText(rider2.name).click({ button: "right" });
  await beeperPage.getByRole("menuitem", { name: "Accept" }).click();

  await expect(
    rider1Page.getByText(
      "Beeper is getting ready to come get you. They will be on the way soon.",
    ),
  ).toBeVisible();

  await expect(rider2Page.getByText("1").first()).toBeVisible();
  await expect(
    rider2Page.getByText("person is ahead of you in User's queue."),
  ).toBeVisible();

  await rider2Page.getByText("...").click();

  await expect(
    rider2Page.getByRole("menuitem", { name: "Cancel Ride" }),
  ).toBeVisible(); // the rider should be allowed to leave the queue

  await expect(rider3Page.getByText("2")).toBeVisible();
  await expect(
    rider3Page.getByText("people are ahead of you in User's queue."),
  ).toBeVisible();

  await rider3Page.getByText("...").click();
  await expect(
    rider3Page.getByRole("menuitem", { name: "Cancel Ride" }),
  ).toBeVisible(); // the rider should be allowed to leave the queue

  // Accept the third rider
  await beeperPage.getByText(rider3.name).click({ button: "right" });
  await beeperPage.getByRole("menuitem", { name: "Accept" }).click();

  await expect(
    rider1Page.getByText(
      "Beeper is getting ready to come get you. They will be on the way soon.",
    ),
  ).toBeVisible();

  await expect(rider2Page.getByText("1").first()).toBeVisible();
  await expect(
    rider2Page.getByText("person is ahead of you in User's queue."),
  ).toBeVisible();

  // await rider2Page.getByText("🧰").click();
  await expect(
    rider2Page.getByRole("menuitem", { name: "Cancel Ride" }),
  ).toBeVisible(); // the rider should be allowed to leave the queue

  await expect(rider3Page.getByText("2")).toBeVisible();
  await expect(
    rider3Page.getByText("people are ahead of you in User's queue."),
  ).toBeVisible();

  // await rider3Page.getByText("🧰").click();
  await expect(
    rider3Page.getByRole("menuitem", { name: "Cancel Ride" }),
  ).toBeVisible(); // the rider should be allowed to leave the queue

  // Close the Queue bottom sheet so the beeper can see the current beep
  await beeperPage.getByText("Queue", { exact: true }).click();

  // Actually being the first beep
  await beeperPage.getByText("I'm on the way 🚕").click();

  await expect(
    rider1Page.getByText("Beeper is on their way to get you."),
  ).toBeVisible();
});
