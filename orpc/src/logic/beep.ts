import * as Sentry from "@sentry/bun";
import z from "zod";
import { and, eq, lt, ne, or } from "drizzle-orm";
import { db } from "../utils/db";
import { beep, beepStatuses } from "../../drizzle/schema";
import { User } from "../utils/pubsub";
import { sendNotification } from "../utils/notifications";

type Beep = typeof beep.$inferSelect;
type BeepStatus = Beep["status"];

export const inProgressBeep = or(
  eq(beep.status, "waiting"),
  eq(beep.status, "accepted"),
  eq(beep.status, "on_the_way"),
  eq(beep.status, "here"),
  eq(beep.status, "in_progress"),
);

export const inProgressBeepNew = {
  OR: [
    { status: "waiting" as const },
    { status: "accepted" as const },
    { status: "on_the_way" as const },
    { status: "here" as const },
    { status: "in_progress" as const },
  ],
};

export const isAcceptedBeepNew = {
  OR: [
    { status: "accepted" as const },
    { status: "here" as const },
    { status: "in_progress" as const },
    { status: "on_the_way" as const },
  ],
};

export const rideResponseSchema = z.object({
  id: z.string(),
  start: z.union([z.string(), z.date()]),
  end: z.union([z.string(), z.date()]).nullable(),
  origin: z.string(),
  destination: z.string(),
  groupSize: z.number(),
  status: z.enum(beepStatuses),
  beeper: z.object({
    id: z.string(),
    first: z.string(),
    last: z.string(),
    venmo: z.string().nullable(),
    cashapp: z.string().nullable(),
    groupRate: z.number(),
    singlesRate: z.number(),
    photo: z.string().nullable(),
  }),
  position: z.number(),
});

export const queueResponseSchema = z.array(
  z.object({
    id: z.string(),
    start: z.date(),
    end: z.date().nullable(),
    origin: z.string(),
    destination: z.string(),
    groupSize: z.number(),
    status: z.enum(beepStatuses),
    rider: z.object({
      id: z.string(),
      first: z.string(),
      last: z.string(),
      venmo: z.string().nullable(),
      cashapp: z.string().nullable(),
      photo: z.string().nullable(),
      rating: z.string().nullable(),
    }),
  }),
);

export function getIsAcceptedBeep(beep: Beep) {
  return (
    beep.status === "accepted" ||
    beep.status === "here" ||
    beep.status === "in_progress" ||
    beep.status === "on_the_way"
  );
}

export function getIsInProgressBeep(beep: Beep) {
  return (
    beep.status === "waiting" ||
    beep.status === "accepted" ||
    beep.status === "here" ||
    beep.status === "in_progress" ||
    beep.status === "on_the_way"
  );
}

export function getQueueSize(queue: Beep[]) {
  return queue.filter(getIsAcceptedBeep).length;
}

export async function getBeeperQueue(beeperId: string) {
  return await db.query.beep.findMany({
    where: { AND: [inProgressBeepNew, { beeper_id: beeperId }] },
    orderBy: { start: "asc" },
    with: {
      beeper: { columns: { password: false, passwordType: false } },
      rider: { columns: { password: false, passwordType: false } },
    },
  });
}

export async function getRidersCurrentRide(userId: string) {
  const b = await db.query.beep.findFirst({
    where: { AND: [inProgressBeepNew, { rider_id: userId }] },
    with: {
      beeper: true,
    },
  });

  if (!b) {
    return null;
  }

  const position = await db.$count(
    beep,
    and(
      eq(beep.beeper_id, b.beeper_id),
      lt(beep.start, b.start),
      ne(beep.status, "waiting"),
      inProgressBeep,
    ),
  );

  return {
    ...b,
    position,
  };
}

export function getPositionInQueue(beep: Beep, queue: Beep[]) {
  return queue.filter((b) => getIsAcceptedBeep(b) && b.start < beep.start)
    .length;
}

export function getDerivedRiderFields(beep: Beep, queue: Beep[]) {
  return {
    position: getPositionInQueue(beep, queue),
  };
}

export async function sendBeepUpdateNotificationToRider(
  riderId: string,
  status: BeepStatus,
  beeper: User,
) {
  const rider = await db.query.user.findFirst({
    columns: {
      pushToken: true,
    },
    where: { id: riderId },
  });

  if (!rider?.pushToken) {
    return;
  }

  switch (status) {
    case "canceled":
      sendNotification({
        to: rider.pushToken,
        title: `${beeper.first} ${beeper.last} has canceled your beep 🚫`,
        body: "Open your app to find a new beep",
      });
      break;
    case "denied":
      sendNotification({
        to: rider.pushToken,
        title: `${beeper.first} ${beeper.last} has denied your beep request 🚫`,
        body: "Open your app to find a different beeper",
      });
      break;
    case "accepted":
      sendNotification({
        to: rider.pushToken,
        title: `${beeper.first} ${beeper.last} has accepted your beep request ✅`,
        body: "You will receive another notification when they are on their way to pick you up",
      });
      break;
    case "on_the_way": {
      const c = await db.query.car.findFirst({
        where: { user_id: beeper.id, default: true },
      });

      let body = "Your beeper is on their way.";

      if (c) {
        body = `Your beeper is on their way in a ${c.color} ${c.make} ${c.model}`;
      }

      sendNotification({
        to: rider.pushToken,
        title: `${beeper.first} ${beeper.last} is on their way 🚕`,
        body,
      });
      break;
    }
    case "here": {
      const c = await db.query.car.findFirst({
        where: { user_id: beeper.id, default: true },
      });

      let body = "Your beeper is here to pick you up.";

      if (c) {
        body = `Look for a ${c.color} ${c.make} ${c.model}`;
      }

      sendNotification({
        to: rider.pushToken,
        title: `${beeper.first} ${beeper.last} is here 📍`,
        body,
      });
      break;
    }
    case "in_progress":
      // Beep is in progress - no notification needed at this stage.
      break;
    case "complete":
      sendNotification({
        to: rider.pushToken,
        title: `Your beep with ${beeper.first} ${beeper.last} is complete 🎉`,
        body: "Please rate your beeper in the app.",
      });
      break;
    default:
      Sentry.captureException(
        "Our beeper's state notification switch statement reached a point that is should not have",
      );
  }
}
