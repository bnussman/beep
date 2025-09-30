import { and, asc, eq, lt, ne, or } from "drizzle-orm";
import { db } from "../utils/db";
import { beep, car } from "../../drizzle/schema";

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

/**
 *  Gets a beeper's queue.
 *
 * @note This queries for all beeper and rider details. Fields should be masked / protected before returned to users.
 */
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
        },
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
    },
  });
}

/**
 * Given a beep and the beeper's whole queue, this returns the rider's beep.
 *
 * @note is masks fields like `car`, `location`, `phone` so that they can only see the beeper's personal info if the beep is accepted
 */
export function getRiderBeepFromBeeperQueue(
  beep: Awaited<ReturnType<typeof getBeeperQueue>>[number],
  queue: Awaited<ReturnType<typeof getBeeperQueue>>,
): Awaited<ReturnType<typeof getRidersCurrentRide>> {
  const isAccpted = getIsAcceptedBeep(beep);

  const position = queue.filter(
    (b) => getIsAcceptedBeep(b) && b.start < beep.start,
  ).length;

  const { rider, ...values } = beep;

  return {
    ...values,
    beeper: {
      id: beep.beeper.id,
      first: beep.beeper.first,
      last: beep.beeper.last,
      photo: beep.beeper.photo,
      singlesRate: beep.beeper.singlesRate,
      groupRate: beep.beeper.groupRate,
      cashapp: beep.beeper.cashapp,
      venmo: beep.beeper.venmo,
      location: isAccpted ? beep.beeper.location : null,
      phone: isAccpted ? beep.beeper.phone : null,
      car: isAccpted ? beep.beeper.cars[0] : null,
    },
    position,
  };
}

/**
 * Given a raw beepers queue, this function does some output transformation to ensure a beeper
 * can only see rider details when they are allowed to.
 */
export function getProtectedBeeperQueue(
  queue: Awaited<ReturnType<typeof getBeeperQueue>>,
) {
  return queue.map(({ beeper, ...beep }) => {
    const isAccepted = getIsAcceptedBeep(beep);
    return {
      ...beep,
      rider: {
        id: beep.rider.id,
        first: beep.rider.first,
        last: beep.rider.last,
        venmo: beep.rider.venmo,
        cashapp: beep.rider.cashapp,
        phone: isAccepted ? beep.rider.phone : null,
        photo: beep.rider.photo,
        rating: beep.rider.rating,
      },
    };
  });
}

/**
 * Gets a rider's current ride
 *
 * @note this function masks beeper's info like `cars`, `phone`, and `location` so that rider can't see sensitive information when they are not allowed to
 */
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

  const isAcceptedBeep = getIsAcceptedBeep(b);

  return {
    ...b,
    beeper: {
      id: b.beeper.id,
      first: b.beeper.first,
      last: b.beeper.last,
      photo: b.beeper.photo,
      singlesRate: b.beeper.singlesRate,
      groupRate: b.beeper.groupRate,
      cashapp: b.beeper.cashapp,
      venmo: b.beeper.venmo,
      location: isAcceptedBeep ? b.beeper.location : null,
      phone: isAcceptedBeep ? b.beeper.phone : null,
      car: isAcceptedBeep ? b.beeper.cars[0] : null,
    },
    position,
  };
}
