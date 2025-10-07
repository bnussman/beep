import z from "zod";
import { and, asc, eq, or } from "drizzle-orm";
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
  riders_before_accepted: z.number(),
  riders_before_unaccepted: z.number(),
  riders_before_total: z.number(),
  total_riders_waiting: z.number(),
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

export function getTotalRidersBefore(
  b: { start: Date },
  queue: (typeof beep.$inferSelect)[],
) {
  return queue.filter((queueBeep) => queueBeep.start < b.start).length;
}

export function getAccptedRidersBefore(
  b: { start: Date },
  queue: (typeof beep.$inferSelect)[],
) {
  return queue.filter(
    (queueBeep) => getIsAcceptedBeep(queueBeep) && queueBeep.start < b.start,
  ).length;
}

export function getUnacceptedRidersBefore(
  b: { start: Date },
  queue: (typeof beep.$inferSelect)[],
) {
  return queue.filter(
    (queueBeep) => !getIsAcceptedBeep(queueBeep) && queueBeep.start < b.start,
  ).length;
}

export function getRidesWaiting(queue: (typeof beep.$inferSelect)[]) {
  return queue.filter((queueBeep) => !getIsAcceptedBeep(queueBeep)).length;
}

export async function getBeeperQueue(beeperId: string) {
  return await db.query.beep.findMany({
    where: and(inProgressBeep, eq(beep.beeper_id, beeperId)),
    orderBy: asc(beep.start),
    with: {
      beeper: { columns: { password: false, passwordType: false } },
      rider: { columns: { password: false, passwordType: false } },
    },
  });
}

export function getRidersDerivedFields(
  b: { start: Date },
  queue: (typeof beep.$inferSelect)[],
) {
  return {
    riders_before_accepted: getAccptedRidersBefore(b, queue),
    riders_before_unaccepted: getUnacceptedRidersBefore(b, queue),
    riders_before_total: getTotalRidersBefore(b, queue),
    total_riders_waiting: queue.filter((beep) => beep.status === "waiting")
      .length,
  };
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

  const queue = await getBeeperQueue(b.beeper.id);

  return {
    ...b,
    ...getRidersDerivedFields(b, queue),
  };
}
