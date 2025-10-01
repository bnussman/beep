import { and, asc, eq, lt, ne, or } from "drizzle-orm";
import { db } from "../utils/db";
import { beep } from "../../drizzle/schema";

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

type BeepStatus = (typeof beep.$inferSelect)["status"];

export function getIsAcceptedBeep(beep: { status: BeepStatus }) {
  return (
    beep.status === "accepted" ||
    beep.status === "here" ||
    beep.status === "in_progress" ||
    beep.status === "on_the_way"
  );
}

export function getQueueSize(queue: { status: BeepStatus }[]) {
  return queue.filter(getIsAcceptedBeep).length;
}

export async function getBeeperQueue(beeperId: string) {
  return await db.query.beep.findMany({
    where: and(inProgressBeep, eq(beep.beeper_id, beeperId)),
    orderBy: asc(beep.start),
    with: {
      beeper: {
        columns: {
          id: true,
          first: true,
          last: true,
          photo: true,
          singlesRate: true,
          groupRate: true,
          capacity: true,
          cashapp: true,
          venmo: true,
        },
      },
      rider: {
        columns: {
          id: true,
          first: true,
          last: true,
          venmo: true,
          cashapp: true,
          photo: true,
          rating: true,
        },
      },
    },
  });
}

export function getRiderBeepFromBeeperQueue(
  beep: Awaited<ReturnType<typeof getBeeperQueue>>[number],
  queue: Awaited<ReturnType<typeof getBeeperQueue>>,
): Awaited<ReturnType<typeof getRidersCurrentRide>> {
  const position = queue.filter(
    (b) => getIsAcceptedBeep(b) && b.start < beep.start,
  ).length;

  const { rider, ...values } = beep;

  return {
    ...values,
    position,
  };
}

export async function getRidersCurrentRide(userId: string) {
  const b = await db.query.beep.findFirst({
    where: and(eq(beep.rider_id, userId), inProgressBeep),
    with: {
      beeper: {
        columns: {
          id: true,
          first: true,
          last: true,
          photo: true,
          singlesRate: true,
          groupRate: true,
          cashapp: true,
          venmo: true,
        },
      },
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
