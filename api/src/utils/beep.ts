import { and, asc, eq, or } from "drizzle-orm";
import { db } from "./db";
import { beep, car } from "../../drizzle/schema";
import { getRidersCurrentRide } from "../routers/rider";

export const inProgressBeep = or(
  eq(beep.status, "waiting"),
  eq(beep.status, "accepted"),
  eq(beep.status, "here"),
  eq(beep.status, "in_progress"),
  eq(beep.status, "on_the_way"),
);

export async function getBeeperQueue(beeperId: string) {
  const queue = await db.query.beep.findMany({
    where: and(
      inProgressBeep,
      eq(beep.beeper_id, beeperId)
    ),
    orderBy: asc(beep.start),
    with: {
      beeper: {
        columns: {
          id: true,
          first: true,
          last: true,
          photo: true,
          location: true,
          singlesRate: true,
          groupRate: true,
          capacity: true,
          phone: true,
          cashapp: true,
          venmo: true,
        },
        with: {
          cars: {
            where: eq(car.default, true),
            limit: 1,
          },
        }
      },
      rider: {
        columns: {
          id: true,
          first: true,
          last: true,
          venmo: true,
          cashapp: true,
          phone: true,
          photo: true,
          rating: true,
          pushToken: true,
        },
      },
    }
  });

  return queue;
}

export function getRiderBeepFromBeeperQueue(riderId: string, queue: Awaited<ReturnType<typeof getBeeperQueue>>): Awaited<ReturnType<typeof getRidersCurrentRide>> {
  const beep = queue.find((beep) => beep.rider_id === riderId);

  if (!beep) {
    throw new Error("Rider's beep not found in queue.")
  }

  const isAccpted = getIsAcceptedBeep(beep);
  const position = queue.filter((b) => getIsAcceptedBeep(b) && b.start < beep.start).length;

  if (!isAccpted) {
    return {
      ...beep,
      position,
      beeper: {
        ...beep.beeper,
        phone: null,
        location: null,
      }
    };
  }

  return {
    ...beep,
    position
  };
}

type BeepStatus = typeof beep.$inferSelect['status'];

export function getIsAcceptedBeep(beep: { status: BeepStatus }) {
  return beep.status === 'accepted' || beep.status === 'here' || beep.status === 'in_progress' || beep.status === 'on_the_way'
}

export function getQueueSize(queue: { status: BeepStatus }[]) {
  return queue.filter(getIsAcceptedBeep).length
}

export function getProtectedBeeperQueue(queue: Awaited<ReturnType<typeof getBeeperQueue>>): Awaited<ReturnType<typeof getBeeperQueue>> {
  for (const beep of queue) {
    const isAcceptedBeep = getIsAcceptedBeep(beep);
    if (!isAcceptedBeep) {
      beep.rider.phone = '';
      beep.rider.pushToken = null;
    }
  }
  return queue;
}
