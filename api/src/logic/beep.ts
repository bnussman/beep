import z from "zod";
import { and, asc, eq, lt, ne, or } from "drizzle-orm";
import { db } from "../utils/db";
import { beep, beepStatuses } from "../../drizzle/schema";

export const inProgressBeep = or(
  eq(beep.status, "waiting"),
  eq(beep.status, "accepted"),
  eq(beep.status, "on_the_way"),
  eq(beep.status, "here"),
  eq(beep.status, "in_progress"),
);

export const isAcceptedBeep = or(
  eq(beep.status, "accepted"),
  eq(beep.status, "on_the_way"),
  eq(beep.status, "here"),
  eq(beep.status, "in_progress"),
);

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
    start: z.union([z.string(), z.date()]),
    end: z.union([z.string(), z.date()]).nullable(),
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

export function getIsAcceptedBeep(beep: {
  status: (typeof beepStatuses)[number];
}) {
  return (
    beep.status === "accepted" ||
    beep.status === "here" ||
    beep.status === "in_progress" ||
    beep.status === "on_the_way"
  );
}

export function getQueueSize(
  queue: { status: (typeof beepStatuses)[number] }[],
) {
  return queue.filter(getIsAcceptedBeep).length;
}

export async function getBeeperQueue(beeperId: string) {
  return await db.query.beep.findMany({
    where: and(inProgressBeep, eq(beep.beeper_id, beeperId)),
    orderBy: asc(beep.start),
    with: {
      beeper: true,
      rider: true,
    },
  });
}

export async function getRidersCurrentRide(userId: string) {
  const b = await db.query.beep.findFirst({
    where: and(eq(beep.rider_id, userId), inProgressBeep),
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
